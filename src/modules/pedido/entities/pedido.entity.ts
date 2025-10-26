import { Decimal } from 'decimal.js';
import { ItemPedido } from '../../../modules/pedido/entities/item-pedido.entity.ts';
import { Cliente } from '../../../modules/usuario/entities/usuario.entity.ts';
import { Endereco } from '../../../modules/usuario/entities/endereco.entity.ts';
import { Produto } from '../../../modules/produto/entities/produto.entity.ts';

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
  private static idsUsados = new Set<string>();

  id: string;
  cliente: Cliente;
  data: Date;
  status: StatusPedido;
  enderecoEntrega?: Endereco; //?: indica atributo opcional
  metodoPagamento?: MetodoPagamento;
  observacao: string;
  itens: ItemPedido[];

  constructor(
    id: string,
    cliente: Cliente,
    data: Date,
    status: StatusPedido,
    enderecoEntrega: Endereco,
    metodoPagamento: MetodoPagamento,
    observacao: string,
    itens: ItemPedido,
  ) {
    if (Pedido.idsUsados.has(id)) {
      throw new Error('Pedido com id já existente');
    }
    Pedido.idsUsados.add(id);

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

  static limparIDs(): void {
    Pedido.idsUsados.clear();
  }

  get clienteCPF(): string {
    return this.cliente.cpf;
  }

  get valorTotal(): Decimal {
    //soma o subtotal de todos os itens atraves do acumulador
    return this.itens.reduce((acc, it) => acc.add(it.subtotal), new Decimal(0));
  }

  adicionarItem(item: ItemPedido): void {
    if (this.status !== StatusPedido.CARRINHO)
      throw new Error('Não é possível alterar itens após fechar o pedido.');

    const existente = this.itens.find((i) => i.produto.id === item.produto.id);
    if (existente) existente.quantidade += item.quantidade;
    else this.itens.push(item);
  }

  removerItem(produtoOuItem: Produto | ItemPedido): void {
    if (this.status !== StatusPedido.CARRINHO) {
      throw new Error('Não é possível alterar itens após fechar o pedido.');
    }
    const produtoId =
      'produto' in produtoOuItem ? produtoOuItem.produto.id : produtoOuItem.id; // fallback
    this.itens = this.itens.filter(
      (i) =>
        i.produto.id !==
        ('id' in produtoOuItem ? (produtoOuItem as Produto).id : produtoId),
    );
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
