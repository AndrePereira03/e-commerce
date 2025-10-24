import { Decimal } from 'decimal.js';
import { Produto } from '../entities/produto.entity.ts';

export type CriarProdutoDTO = {
  id: string;
  nome: string;
  precoUnitario: string | number;
  estoque: number;
  descricao?: string;
};

export function toProduto(dto: CriarProdutoDTO): Produto {
  return new Produto(
    dto.id,
    dto.nome,
    new Decimal(dto.precoUnitario),
    dto.estoque,
  );
}
