import { Decimal } from 'decimal.js';
import { Pedido } from './pedido.entity.ts';
import { Produto } from '../../../modules/produto/entities/produto.entity.ts';

export class ItemPedido {
  produto: Produto;
  quantidade: number;
  precoUnidade: Decimal;

  constructor(produto: Produto, quantidade: number, precoUnidade: Decimal) {
    this.produto = produto;
    this.quantidade = quantidade;
    this.precoUnidade = precoUnidade;

    if (!Number.isInteger(quantidade))
      throw new Error('Quantidade deve ser inteira.');

    if (quantidade <= 0)
      throw new Error('Quantidade deve ser não nula e não negativa.');

    if (
      new Decimal(precoUnidade).isNegative() ||
      new Decimal(precoUnidade).isZero()
    ) {
      throw new Error('Preço deve ser positivo.');
    }
  }

  get subtotal(): Decimal {
    return this.precoUnidade.mul(this.quantidade);
  }

  incluir(pedido: Pedido): void {
    pedido.adicionarItem(this);
  }

  exluir(pedido: Pedido): void {
    pedido.removerItem(this);
  }
}
