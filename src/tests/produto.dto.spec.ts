import { describe, it, expect } from 'vitest';
import * as dec from 'decimal.js';
const DecimalCtor: any =
  (dec as any).default ?? (dec as any).Decimal ?? (dec as any);
const D = (v: any) => new DecimalCtor(v);

import { toProduto } from '../modules/produto/dtos/produto.dto.ts';
import type { CriarProdutoDTO } from '../modules/produto/dtos/produto.dto.ts';
import { Produto } from '../modules/produto/entities/produto.entity.ts';

describe('DTO → Produto', () => {
  it('mapeia DTO para entidade Produto', () => {
    const dto: CriarProdutoDTO = {
      id: 'produto1',
      nome: 'Teclado',
      precoUnitario: '99.90',
      estoque: 10,
      descricao: 'Teclado mecânico',
    };

    const produto = toProduto(dto);

    expect(produto).toBeInstanceOf(Produto);
    expect(produto.id).toBe('produto1');
    expect(produto.nome).toBe('Teclado');
    expect(String(produto.preco)).toBe(String(D('99.90')));
    expect(produto.estoque).toBe(10);
  });
});
