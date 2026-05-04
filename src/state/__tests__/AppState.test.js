import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppState, initAppState } from '../AppState.js';

describe('AppState', () => {
  beforeEach(() => {
    // Limpa o localStorage antes de cada teste
    localStorage.clear();
    // Reseta o estado para o valor inicial
    AppState.setState({
      petType: null,
      currentPage: null,
      loading: false,
      error: null
    });
  });

  it('deve ter um estado inicial correto', () => {
    const state = AppState.getState();
    expect(state.petType).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('deve atualizar o estado corretamente', () => {
    AppState.setState({ petType: 'cat', loading: true });
    const state = AppState.getState();
    expect(state.petType).toBe('cat');
    expect(state.loading).toBe(true);
  });

  it('deve notificar os inscritos quando o estado mudar', () => {
    const callback = vi.fn();
    AppState.subscribe(callback);
    
    // O subscribe chama o callback imediatamente com o estado atual
    expect(callback).toHaveBeenCalledTimes(1);
    
    AppState.setState({ petType: 'dog' });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ petType: 'dog' }));
  });

  it('deve inicializar a partir do localStorage', async () => {
    localStorage.setItem('petflix_selected_species', 'cat');
    
    await initAppState();
    
    const state = AppState.getState();
    expect(state.petType).toBe('cat');
  });
});
