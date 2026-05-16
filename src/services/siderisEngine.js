import { useState, useEffect } from 'react';

// --- MIDNIGHT ARCHITECTURE SIMULATION: PRIVATE STATE ---
// Estos valores se mantienen fuera del objeto/clase exportada para simular 
// el estado privado (Private State) de un zk-contract en Midnight Network. 
// Solo la lógica interna del contrato (los métodos abajo) puede acceder y 
// mutar esta información. El cliente no puede leer los montos reales.
let privateBids = [];
let currentWinner = null;

// Estados Públicos del Contrato
export const AUCTION_STATES = {
  IDLE: 'IDLE',
  OPEN: 'OPEN',
  BIDDING: 'BIDDING',
  CLOSED: 'CLOSED',
  RESOLVED: 'RESOLVED'
};

class SiderisEngine {
  constructor() {
    // Implementación Singleton
    if (SiderisEngine.instance) {
      return SiderisEngine.instance;
    }
    
    // --- PUBLIC STATE ---
    this.state = AUCTION_STATES.IDLE;
    this.deadline = null;
    this.publicBidsCount = 0;
    
    // Sistema básico de Reactividad (Pub/Sub) para conectar con React
    this.listeners = new Set();
    
    SiderisEngine.instance = this;
  }

  // Notifica a los hooks de React sobre cambios en el estado público
  _notifyListeners() {
    for (const listener of this.listeners) {
      listener({ ...this });
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  startAuction(deadline) {
    if (this.state !== AUCTION_STATES.IDLE && this.state !== AUCTION_STATES.RESOLVED) {
      throw new Error("Una subasta ya se encuentra en curso.");
    }
    this.state = AUCTION_STATES.OPEN;
    this.deadline = deadline;
    
    // Resetear el estado privado para la nueva subasta
    privateBids = [];
    currentWinner = null;
    this.publicBidsCount = 0;
    
    this._notifyListeners();
  }

  // Simula la generación y envío de un Zero-Knowledge proof
  async submitBid(amount, supplierId) {
    if (this.state !== AUCTION_STATES.OPEN && this.state !== AUCTION_STATES.BIDDING) {
      throw new Error("La subasta no está abierta para recibir ofertas.");
    }
    
    // Transición a BIDDING para UI (ej. mostrar loader de generación de ZK Proof)
    this.state = AUCTION_STATES.BIDDING;
    this._notifyListeners();

    // Delay de 1.5s simulando la carga de red y validación en zkVM
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Guardar el monto real de forma PRIVADA
    privateBids.push({ 
      amount: Number(amount), 
      supplierId, 
      timestamp: Date.now() 
    });
    
    // Mutar el estado PÚBLICO
    this.publicBidsCount++;
    this.state = AUCTION_STATES.OPEN; 
    this._notifyListeners();

    // Generar mocks criptográficos para el receipt
    const mockHash = () => Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');

    return {
      zkProof: `0x${mockHash()}`,
      witnessHash: `0x${mockHash()}`,
      timestamp: Date.now()
    };
  }

  resolveAuction() {
    if (this.state === AUCTION_STATES.RESOLVED) {
      return currentWinner;
    }
    
    // Cierra la subasta temporalmente mientras resuelve
    this.state = AUCTION_STATES.CLOSED;
    this._notifyListeners();

    if (privateBids.length === 0) {
      this.state = AUCTION_STATES.RESOLVED;
      this._notifyListeners();
      return null; // Nadie ofertó
    }

    // Determina el ganador (el proveedor con la oferta más baja en un reverse-auction clásico)
    currentWinner = privateBids.reduce((prev, curr) => 
      (curr.amount < prev.amount) ? curr : prev
    );

    this.state = AUCTION_STATES.RESOLVED;
    this._notifyListeners();
    
    // Una vez resuelta, el monto ganador se vuelve público
    return {
      supplierId: currentWinner.supplierId,
      winningAmount: currentWinner.amount
    };
  }
}

// Exportamos la instancia única (Singleton)
export const siderisEngine = new SiderisEngine();

// --- REACT HOOKS EXPORTS ---

export function useSiderisAuction() {
  const [engineState, setEngineState] = useState(() => ({
    state: siderisEngine.state,
    deadline: siderisEngine.deadline,
    publicBidsCount: siderisEngine.publicBidsCount
  }));

  useEffect(() => {
    // Nos suscribimos a cualquier cambio del engine
    const unsubscribe = siderisEngine.subscribe((newState) => {
      setEngineState({
        state: newState.state,
        deadline: newState.deadline,
        publicBidsCount: newState.publicBidsCount
      });
    });
    return unsubscribe;
  }, []);

  return {
    ...engineState,
    startAuction: (deadline) => siderisEngine.startAuction(deadline),
    submitBid: (amount, supplierId) => siderisEngine.submitBid(amount, supplierId),
    resolveAuction: () => siderisEngine.resolveAuction()
  };
}
