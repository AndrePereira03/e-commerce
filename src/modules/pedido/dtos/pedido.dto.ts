import { Decimal } from 'decimal.js';
import { Pedido } from '../entities/pedido.entity.ts';
import type {
  MetodoPagamento,
  StatusPedido,
} from '../entities/pedido.entity.ts';
import { ItemPedido } from '../entities/item-pedido.entity.ts';
import { Cliente } from '@modules/usuario/entities/usuario.entity.ts';
import { Endereco } from '@modules/usuario/entities/endereco.entity.ts';
import { Produto } from '@modules/produto/entities/produto.entity.ts';

export type CriarItemDTO = {
  produto: Produto;
  quantidade: number;
  precoUnidade: string | number;
};

export type CriarPedidoDTO = {
  id: string;
  cliente: Cliente;
  data: Date;
  status: StatusPedido;
  enderecoEntrega: Endereco;
  metodoPagamento: MetodoPagamento;
  observacao: string;
  itens: CriarItemDTO[];
};

export function toPedido(dto: CriarPedidoDTO): Pedido {
  const itens = dto.itens.map(
    (i) => new ItemPedido(i.produto, i.quantidade, new Decimal(i.precoUnidade)),
  );

  if (itens.length === 0) {
    throw new Error('Pedido deve conter ao menos um item');
  }

  const primeiroItem = itens[0]!;

  const pedido = new Pedido(
    dto.id,
    dto.cliente,
    dto.data,
    dto.status,
    dto.enderecoEntrega,
    dto.metodoPagamento,
    dto.observacao,
    primeiroItem,
  );

  for (let i = 1; i < itens.length; i++) {
    const item = itens[i]!;
    pedido.adicionarItem(item);
  }

  return pedido;
}
