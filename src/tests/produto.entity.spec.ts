import { describe, it, expect } from 'vitest';
import { Decimal } from 'decimal.js';
import { Produto } from '../modules/produto/entities/produto.entity.ts';

describe('Produto', () => {
  it('cria produto com nome válido', () => {
    const p = new Produto('produto143432', 'Teclado', new Decimal('99.90'), 10);
    expect(p.nome).toBe('Teclado');
  });

  it('rejeita preço negativo ou nulo', () => {
    expect(
      () => new Produto('produto2234234', 'Mouse', new Decimal('-1'), 1),
    ).toThrow(/preço/i);
    expect(
      () => new Produto('produto343244', 'Monitor', new Decimal('0'), 1),
    ).toThrow(/preço/i);
  });

  it('permite repor estoque', () => {
    const p = new Produto('produto44324423', 'Fonte', new Decimal('350'), 3);
    p.reporEstoque(3);
    expect(p.estoque).toBe(6);
  });

  it('rejeita repor estoque', () => {
    const p = new Produto('produto534243', 'Gabinete', new Decimal('100'), 6);
    expect(() => p.reporEstoque(0)).toThrow(/quantidade/i);
    expect(() => p.reporEstoque(-3)).toThrow(/quantidade/i);
  });

  it('permite debitar estoque', () => {
    const p = new Produto('produto213123', 'Cooler', new Decimal('343'), 8);
    p.debitarEstoque(3);
    expect(p.estoque).toBe(5);
  });

  it('rejeita debitar estoque', () => {
    const p = new Produto('produto123123', 'Placa-mãe', new Decimal('400'), 3);
    expect(() => p.debitarEstoque(5)).toThrow(/estoque/i);
    expect(() => p.debitarEstoque(0)).toThrow(/estoque/i);
    expect(() => p.debitarEstoque(-5)).toThrow(/estoque/i);
  });

  it('permite alterar preco', () => {
    const p = new Produto('produto022123', 'TV', new Decimal('1567'), 4);
    p.alterarPreco(new Decimal('1800'));
    expect(p.preco.toString()).toBe('1800');
  });

  it('rejeita alterar preco', () => {
    const p = new Produto(
      'produto123243',
      'Caixa de som',
      new Decimal('200'),
      3,
    );
    expect(() => p.alterarPreco(new Decimal('0'))).toThrow(/preço/i);
    expect(() => p.alterarPreco(new Decimal('-1'))).toThrow(/preço/i);
  });
});
