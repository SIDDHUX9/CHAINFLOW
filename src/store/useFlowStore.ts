import { create } from "zustand";
import { checkFreighterConnected, getFreighterPublicKey, signInvoiceTransaction } from "../utils/stellar";
import { playWalletConnect, playWalletDisconnect } from "../utils/audio";

export interface Invoice {
  id: string;
  title: string;
  issuer: string;
  counterparty: string;
  amount: number; // in USD
  yieldRate: number; // APY
  dueDate: string;
  status: "active" | "pending" | "disputed" | "settled" | "rejected";
  riskScore: number; // 1-100 (high is riskier)
  country: string;
  countryCode: string; // for 3D Globe matching
  lat: number;
  lng: number;
  industry: string;
  fractionCount: number;
  availableFractions: number;
  fractionPrice: number; // in XLM
  description: string;
  txHash?: string;
  investors: { address: string; share: number }[];
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning";
  title: string;
  description: string;
  timestamp: Date;
}

interface FlowState {
  // Preloader
  loadingProgress: number;
  loadingComplete: boolean;
  setLoadingProgress: (progress: number) => void;
  setLoadingComplete: (complete: boolean) => void;

  // Custom Cursor
  cursorHovered: boolean;
  setCursorHovered: (hovered: boolean) => void;

  // Wallet
  walletAddress: string | null;
  walletConnected: boolean;
  walletConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;

  // Navigation & Page Transitions
  activePage: string;
  transitioning: boolean;
  setPage: (page: string) => void;
  setTransitioning: (trans: boolean) => void;

  // Invoices & Market
  invoices: Invoice[];
  activeRole: "business" | "investor";
  setActiveRole: (role: "business" | "investor") => void;
  addInvoice: (invoice: Omit<Invoice, "id" | "status" | "investors" | "availableFractions">) => Promise<Invoice>;
  investInInvoice: (invoiceId: string, fractionsCount: number) => Promise<boolean>;

  // Notifications
  notifications: Notification[];
  addNotification: (type: "success" | "error" | "warning", title: string, description: string) => void;
  removeNotification: (id: string) => void;

  // Investor Profile stats
  investorStats: {
    totalInvested: number; // in USD
    returnsEarned: number; // in USD
    activeDealsCount: number;
    walletBalance: number; // in XLM
  };

  // OCR Ingestion state
  scannedInvoice: Omit<Invoice, "id" | "status" | "investors" | "availableFractions"> | null;
  setScannedInvoice: (invoice: Omit<Invoice, "id" | "status" | "investors" | "availableFractions"> | null) => void;
}

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "cf-inv-001",
    title: "Organic Tea Leaves Export",
    issuer: "Maria's Agriculture Ltd",
    counterparty: "Global Beverages GmbH",
    amount: 12500,
    yieldRate: 11.8,
    dueDate: "2026-09-15",
    status: "active",
    riskScore: 28,
    country: "Kenya",
    countryCode: "KE",
    lat: -1.2921,
    lng: 36.8219,
    industry: "Agriculture",
    fractionCount: 100,
    availableFractions: 40,
    fractionPrice: 50, // 50 XLM per fraction
    description: "Export invoice for organic black tea leaves shipped from Mombasa port to Hamburg.",
    txHash: "cf10076a4a985fde77d85ea150c266cf17f7b3c2",
    investors: [
      { address: "GBDU...4F3E", share: 30 },
      { address: "GD4K...R79L", share: 30 }
    ]
  },
  {
    id: "cf-inv-002",
    title: "Solar Module Assembly Batch 4",
    issuer: "Li Wei Electrics",
    counterparty: "Suntech Power Corp",
    amount: 45000,
    yieldRate: 9.5,
    dueDate: "2026-08-30",
    status: "pending",
    riskScore: 18,
    country: "China",
    countryCode: "CN",
    lat: 31.2304,
    lng: 121.4737,
    industry: "Renewable Energy",
    fractionCount: 500,
    availableFractions: 500,
    fractionPrice: 36,
    description: "Production and quality control certification for PV solar panel components.",
    txHash: "cf9988ea4a985fde77d85ea150c266cf17f7b309",
    investors: []
  },
  {
    id: "cf-inv-003",
    title: "Micro-Processor Custom Wafers",
    issuer: "BriteChip Taiwan",
    counterparty: "FutureTech Systems",
    amount: 89000,
    yieldRate: 14.2,
    dueDate: "2026-10-10",
    status: "disputed",
    riskScore: 82,
    country: "Taiwan",
    countryCode: "TW",
    lat: 25.0330,
    lng: 121.5654,
    industry: "Semiconductors",
    fractionCount: 1000,
    availableFractions: 120,
    fractionPrice: 44,
    description: "Pending verification due to quality audit check in Hsinchu Science Park.",
    txHash: "cfaa77ea4a985fde77d85ea150c266cf17f7b364",
    investors: [
      { address: "GCW3...P97K", share: 88 }
    ]
  },
  {
    id: "cf-inv-004",
    title: "Logistics Fleet Biofuel Supply",
    issuer: "EcoFuel Rotterdam",
    counterparty: "Pan-European Freight",
    amount: 21000,
    yieldRate: 10.4,
    dueDate: "2026-09-01",
    status: "active",
    riskScore: 35,
    country: "Netherlands",
    countryCode: "NL",
    lat: 51.9244,
    lng: 4.4777,
    industry: "Logistics",
    fractionCount: 200,
    availableFractions: 150,
    fractionPrice: 42,
    description: "Bulk bio-diesel fuel delivery factoring invoice for road freight distribution network.",
    txHash: "cfbb11ea4a985fde77d85ea150c266cf17f7b881",
    investors: [
      { address: "GAZ8...82KD", share: 25 }
    ]
  },
  {
    id: "cf-inv-005",
    title: "Artisanal Coffee Shipments",
    issuer: "Andina Growers Cooperativa",
    counterparty: "Specialty Roasters Inc",
    amount: 8200,
    yieldRate: 12.5,
    dueDate: "2026-11-20",
    status: "active",
    riskScore: 40,
    country: "Colombia",
    countryCode: "CO",
    lat: 4.7110,
    lng: -74.0721,
    industry: "Agriculture",
    fractionCount: 100,
    availableFractions: 100,
    fractionPrice: 32,
    description: "Direct-trade micro-lot coffee beans shipping from Buenaventura to Seattle.",
    txHash: "cfdd22ea4a985fde77d85ea150c266cf17f7b492",
    investors: []
  }
];

export const useFlowStore = create<FlowState>((set, get) => ({
  // Preloader
  loadingProgress: 0,
  loadingComplete: false,
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setLoadingComplete: (complete) => set({ loadingComplete: complete }),

  // Custom Cursor
  cursorHovered: false,
  setCursorHovered: (hovered) => set({ cursorHovered: hovered }),

  // Wallet
  walletAddress: null,
  walletConnected: false,
  walletConnecting: false,

  connectWallet: async () => {
    set({ walletConnecting: true });
    try {
      const isFreighter = await checkFreighterConnected();
      if (!isFreighter) {
        get().addNotification(
          "error",
          "Freighter Not Detected",
          "Please install the Freighter browser extension to connect."
        );
        set({ walletConnecting: false });
        return;
      }

      const pubKey = await getFreighterPublicKey();
      if (pubKey) {
        set({ walletAddress: pubKey, walletConnected: true, walletConnecting: false });
        playWalletConnect();
        get().addNotification(
          "success",
          "Wallet Connected",
          `Successfully connected to Freighter: ${pubKey.slice(0, 6)}...${pubKey.slice(-6)}`
        );
      } else {
        throw new Error("No public key returned from Freighter.");
      }
    } catch (error: unknown) {
      console.error(error);
      const errMsg = error instanceof Error ? error.message : "Failed to authorize Freighter wallet.";
      get().addNotification(
        "error",
        "Connection Failed",
        errMsg
      );
      set({ walletConnecting: false, walletConnected: false, walletAddress: null });
    }
  },

  disconnectWallet: () => {
    set({ walletAddress: null, walletConnected: false });
    playWalletDisconnect();
    get().addNotification(
      "warning",
      "Wallet Disconnected",
      "Your Freighter wallet has been disconnected from ChainFlow."
    );
  },

  // Navigation
  activePage: "/",
  transitioning: false,
  setPage: (page) => set({ activePage: page }),
  setTransitioning: (trans) => set({ transitioning: trans }),

  // Invoices & Market
  invoices: INITIAL_INVOICES,
  activeRole: "investor",
  setActiveRole: (role) => set({ activeRole: role }),

  addInvoice: async (newInv) => {
    const id = `cf-inv-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Simulate smart contract interactions by requesting Freighter to sign
    const address = get().walletAddress;
    let txHash = `cf${Math.random().toString(16).slice(2, 40)}`;
    
    if (address) {
      get().addNotification("warning", "Signing Transaction", "Please approve the tokenization request in Freighter.");
      const result = await signInvoiceTransaction(address, id, newInv.amount / 100); // simulate 1% fee on contract
      if (result.success && result.txHash) {
        txHash = result.txHash;
      }
    }

    const created: Invoice = {
      ...newInv,
      id,
      status: "pending", // starts as pending for oracle audit
      availableFractions: newInv.fractionCount,
      txHash,
      investors: []
    };

    set((state) => ({
      invoices: [created, ...state.invoices]
    }));

    get().addNotification(
      "success",
      "Invoice Tokenized",
      `Invoice ${id} minted on-chain. Oracle verification pending.`
    );

    // Auto-approve after 15 seconds to simulate oracle processing!
    setTimeout(() => {
      set((state) => ({
        invoices: state.invoices.map((inv) => 
          inv.id === id ? { ...inv, status: "active" } : inv
        )
      }));
      get().addNotification(
        "success",
        "Oracle Attestation Approved",
        `Invoice ${id} verified. Live in Marketplace.`
      );
    }, 15000);

    return created;
  },

  investInInvoice: async (invoiceId, fractionsCount) => {
    const invoice = get().invoices.find((i) => i.id === invoiceId);
    if (!invoice) return false;

    if (invoice.availableFractions < fractionsCount) {
      get().addNotification("error", "Investment Failed", "Requested fraction amount is unavailable.");
      return false;
    }

    const cost = fractionsCount * invoice.fractionPrice;
    const address = get().walletAddress;

    if (!address) {
      get().addNotification("error", "Wallet Required", "Please connect your Freighter wallet to invest.");
      return false;
    }

    get().addNotification("warning", "Awaiting Signature", `Confirming payment of ${cost} XLM in Freighter.`);

    // Perform real transaction signing via Freighter!
    const result = await signInvoiceTransaction(address, invoiceId, cost);

    if (!result.success) {
      get().addNotification("error", "Transaction Cancelled", result.error || "User rejected signing.");
      return false;
    }

    // Deduct balances and update database locally
    set((state) => {
      const updatedInvoices = state.invoices.map((inv) => {
        if (inv.id === invoiceId) {
          const existingInvIdx = inv.investors.findIndex((i) => i.address === address);
          const newInvestors = [...inv.investors];
          const newShare = (fractionsCount / inv.fractionCount) * 100;
          
          if (existingInvIdx > -1) {
            newInvestors[existingInvIdx].share += newShare;
          } else {
            newInvestors.push({ address, share: newShare });
          }

          return {
            ...inv,
            availableFractions: inv.availableFractions - fractionsCount,
            investors: newInvestors
          };
        }
        return inv;
      });

      const dollarsInvested = (cost * 0.12); // rough conversion just for visual stats

      return {
        invoices: updatedInvoices,
        investorStats: {
          ...state.investorStats,
          totalInvested: state.investorStats.totalInvested + dollarsInvested,
          activeDealsCount: state.investorStats.activeDealsCount + 1,
          walletBalance: Math.max(0, state.investorStats.walletBalance - cost)
        }
      };
    });

    get().addNotification(
      "success",
      "Investment Confirmed",
      `Acquired ${fractionsCount} fractions of ${invoice.id} (TX: ${result.txHash?.slice(0, 10)}...)`
    );

    return true;
  },

  // Notifications
  notifications: [],
  addNotification: (type, title, description) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotif: Notification = {
      id,
      type,
      title,
      description,
      timestamp: new Date()
    };
    set((state) => ({ notifications: [newNotif, ...state.notifications] }));
  },
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),

  // Profile stats
  investorStats: {
    totalInvested: 35000,
    returnsEarned: 2450,
    activeDealsCount: 3,
    walletBalance: 12450
  },

  // OCR Ingestion state
  scannedInvoice: null,
  setScannedInvoice: (invoice) => set({ scannedInvoice: invoice })
}));
