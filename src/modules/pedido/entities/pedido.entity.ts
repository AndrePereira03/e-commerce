import { Decimal } from 'decimal.js';
import { PedidoItem } from './pedido-item.entity.js';
import { Cliente } from '@modules/usuario/entities/usuario.entity.ts';
import { Endereco } from '@modules/usuario/entities/endereco.entity.ts';

export enum StatusPedido {
  CARRINHO = 'CARRINHO',
  AGUARDANDO_PAGAMENTO = 'AGUARDANDO_PAGAMENTO',
  PAGO = 'PAGO',
  CONCLUIDO = 'CONCLUIDO',
  ENVIADO = 'ENVIADO',
  CANCELADO = 'CANCELADO',
}

export enum MetodoPagamento {
  CARTAO = 'CARTAO',
  PIX = 'PIX',
  BOLETO = 'BOLETO',
}

export class Pedido {
  id: string;
  cliente: Cliente;
  data: Date;
  status: StatusPedido;
  enderecoEntrega?: Endereco; //?: indica atributo opcional
  metodoPagamento?: MetodoPagamento;
  observacao: string;
  itens: PedidoItem[];

  constructor(
    id: string,
    cliente: Cliente,
    data: Date,
    status: StatusPedido,
    enderecoEntrega: Endereco,
    metodoPagamento: MetodoPagamento,
    observacao: string,
    itens: PedidoItem,
  ) {
    this.id = id;
    this.cliente = cliente;
    this.data = data;
    this.status = status;
    this.enderecoEntrega = enderecoEntrega;
    this.metodoPagamento = metodoPagamento;
    this.observacao = observacao;
    this.itens = [];

    if (enderecoEntrega.usuario.cpf != cliente.cpf) {
      throw new Error('Endereco nao pertence ao cliente.');
    }
  }

  get clienteCPF(): string {
    return this.cliente.cpf;
  }

  get valorTotal(): Decimal {
    //soma o subtotal de todos os itens atraves do acumulador
    return this.itens.reduce((acc, it) => acc.add(it.subtotal), new Decimal(0));
  }

  adicionarItem(item: PedidoItem): void {
    if (this.status !== StatusPedido.CARRINHO)
      throw new Error('Não é possível alterar itens após fechar o pedido.');

    const existente = this.itens.find((i) => i.produtoID === item.produtoID);
    if (existente) existente.quantidade += item.quantidade;
    else this.itens.push(item);
  }

  removerItem(item: PedidoItem): void {
    if (this.status !== StatusPedido.CARRINHO)
      throw new Error('Não é possível alterar itens após fechar o pedido.');
    this.itens = this.itens.filter((i) => i.produtoID !== item);
  }

  finalizarPedido(metodo: MetodoPagamento): void {
    if (this.itens.length === 0)
      throw new Error('O pedido precisa ter ao menos um item.');

    this.metodoPagamento = metodo;
    this.status = StatusPedido.AGUARDANDO_PAGAMENTO;
  }

  confirmarPagamento(): void {
    if (this.status !== StatusPedido.AGUARDANDO_PAGAMENTO)
      throw new Error('Estado inválido para confirmar pagamento.');

    this.status = StatusPedido.PAGO;
  }

  enviarPedido(): void {
    if (this.status !== StatusPedido.PAGO)
      throw new Error('Somente pedidos pagos podem ser enviados.');
    this.status = StatusPedido.ENVIADO;
  }

  concluirPedido(): void {
    if (this.status !== StatusPedido.ENVIADO)
      throw new Error('O pedido precisa ser enviado antes de ser concluído.');
    this.status = StatusPedido.CONCLUIDO;
  }

  cancelar(motivo?: string): void {
    if (this.status === StatusPedido.CONCLUIDO)
      throw new Error('Pedido concluído não pode ser cancelado');
    this.status = StatusPedido.CANCELADO;
    if (motivo) this.observacao = motivo;
  }
}
