import { describe, it, expect, beforeEach } from 'vitest';
import * as dec from 'decimal.js';
const DecimalCtor: any =
  (dec as any).default ?? (dec as any).Decimal ?? (dec as any);
const D = (v: any) => new DecimalCtor(v);

import { ItemPedido } from '../modules/pedido/entities/item-pedido.entity.ts';
import { Produto } from '../modules/produto/entities/produto.entity.ts';

describe('ItemPedido (entidade)', () => {
  let produtoA: Produto;

  beforeEach(() => {
    if ((Produto as any).limparIDs) (Produto as any).limparIDs();
    produtoA = new Produto('prod-001', 'Teclado Mecânico', D('199.99'), 100);
  });

  it('cria item válido e calcula subtotal', () => {
    const item = new ItemPedido(produtoA, 3, D('199.99'));
    expect(item.produto).toBe(produtoA);
    expect(item.quantidade).toBe(3);
    expect(item.precoUnidade.toString()).toBe('199.99');
    expect(item.subtotal.toString()).toBe('599.97');
  });

  it('rejeita quantidade zero ou negativa', () => {
    expect(() => new ItemPedido(produtoA, 0, D('60'))).toThrow(
      /quantidade.* nula/i,
    );
    expect(() => new ItemPedido(produtoA, -1, D('70'))).toThrow(
      /quantidade.* negativa/i,
    );
  });

  it('rejeita quantidade não inteira', () => {
    expect(() => new ItemPedido(produtoA, 1.5, D('10'))).toThrow(
      /quantidade.* inteira/i,
    );
  });
  it('rejeita preço zero ou negativo', () => {
    expect(() => new ItemPedido(produtoA, 1, D('0'))).toThrow(
      /Preço.* positivo/i,
    );
  });

  it('rejeita preço zero ou negativo', () => {
    expect(() => new ItemPedido(produtoA, 1, D('-5'))).toThrow(
      /Preço.* positivo/i,
    );
  });

  //ideia de que, mudar algo em produto, não "quebra" item
  it('atualiza nome produto e mantém as propriedades do item', () => {
    const item = new ItemPedido(produtoA, 1, D('300'));
    expect(item.produto).toBe(produtoA);
    produtoA.nome = 'Teclado Atualizado';
    expect(item.produto.nome).toBe('Teclado Atualizado');
  });
});
