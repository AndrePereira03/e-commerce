import { describe } from 'vitest';
import { it } from 'vitest';
import { Pedido } from '../modules/pedido/entities/pedido.entity.ts';
import { ItemPedido } from '../modules/pedido/entities/item-pedido.entity.ts';
import { Cliente } from '../modules/usuario/entities/usuario.entity.ts';
import { Endereco } from '../modules/usuario/entities/endereco.entity.ts';
import { Produto } from '../modules/produto/entities/produto.entity.ts';
import { StatusPedido } from '../modules/pedido/entities/pedido.entity.ts';
import { MetodoPagamento } from '../modules/pedido/entities/pedido.entity.ts';
import { beforeEach } from 'vitest';
import { expect } from 'vitest';
import { Decimal } from 'decimal.js';

import * as dec from 'decimal.js';
const DecimalCtor: any =
  (dec as any).default ?? (dec as any).Decimal ?? (dec as any);
const D = (v: any) => new DecimalCtor(v); //atalho para chamar Decimal apenas com D.('12'), por exemplo

describe('Pedido', () => {
  let clienteA: Cliente;
  let enderecoClienteA: Endereco;
  let clienteB: Cliente;
  let enderecoClienteB: Endereco;
  let produtoA: Produto;
  let produtoB: Produto;

  beforeEach(() => {
    if (typeof (Pedido as any).limparIDs === 'function')
      (Pedido as any).limparIDs();
    if (typeof (Produto as any).limparIDs === 'function')
      (Produto as any).limparIDs();

    clienteA = new Cliente(
      '95497873626',
      'André Pereira',
      'andre.pereira@estudante.ufjf.br',
      'senha1234',
      new Date('2003-11-25'),
    );

    enderecoClienteA = new Endereco(
      clienteA,
      'Avenida Presidente Costa e Silva',
      'São Pedro',
      '10',
      'Casa',
      'JF',
      'MG',
      '36037000',
    );

    produtoA = new Produto(
      'produto0001',
      'Computador',
      new Decimal('3540'),
      20,
    );

    clienteB = new Cliente(
      '83285453222',
      'Iandra Siqueira',
      'iandra.siqueira@estudante.ufjf.br',
      'senha12345',
      new Date('2004-02-17'),
    );

    enderecoClienteB = new Endereco(
      clienteB,
      'Avenida Presidente Costa e Silva',
      'São Pedro',
      '10',
      'Casa',
      'JF',
      'MG',
      '36037000',
    );

    produtoB = new Produto('produto0002', 'Notebook', new Decimal('3532'), 20);
  });

  it('permite criar pedido e calcula total', () => {
    const itens = [new ItemPedido(produtoA, 2, D('100'))]; // 2 itens a 100 reais = 200
    const pedido = new Pedido(
      'pedido0001',
      clienteA,
      new Date('2025-10-26'),
      StatusPedido.CARRINHO,
      enderecoClienteA,
      MetodoPagamento.PIX,
      'nenhuma observacao',
      itens,
    );

    expect(pedido.clienteCPF).toBe(clienteA.cpf);
    expect(pedido.enderecoEntrega).toBe(enderecoClienteA);
    expect(pedido.itens.length).toBe(1);
  });

  it('permite criar pedidos com IDs diferentes', () => {
    const itensA = [new ItemPedido(produtoA, 2, D('100'))];
    const itensB = [new ItemPedido(produtoB, 2, D('100'))];
    const a = new Pedido(
      'pedido000',
      clienteA,
      new Date(),
      StatusPedido.CARRINHO,
      enderecoClienteA,
      MetodoPagamento.PIX,
      '',
      itensA,
    );
    const b = new Pedido(
      'pedido0005',
      clienteB,
      new Date(),
      StatusPedido.CARRINHO,
      enderecoClienteB,
      MetodoPagamento.PIX,
      '',
      itensB,
    );
    expect(a.id).not.toBe(b.id);
  });

  it('rejeita criar pedidos com IDs iguais', () => {
    const itensA = [new ItemPedido(produtoA, 2, D('100'))];
    const itensB = [new ItemPedido(produtoB, 2, D('100'))];
    new Pedido(
      'pedido0001',
      clienteA,
      new Date(),
      StatusPedido.CARRINHO,
      enderecoClienteA,
      MetodoPagamento.PIX,
      '',
      itensA,
    );
    expect(
      () =>
        new Pedido(
          'pedido0001',
          clienteA,
          new Date(),
          StatusPedido.CARRINHO,
          enderecoClienteA,
          MetodoPagamento.PIX,
          '',
          itensB,
        ),
    ).toThrow(/id.*existente/i);
  });

  it('rejeita se endereço não pertence ao cliente', () => {
    const itens = [new ItemPedido(produtoA, 1, D('100'))];
    expect(
      () =>
        new Pedido(
          'pedido0003',
          clienteA,
          new Date(),
          StatusPedido.CARRINHO,
          enderecoClienteB,
          MetodoPagamento.CARTAO,
          '',
          itens,
        ),
    ).toThrow(/endereco.*cliente/i);
  });

  it('rejeita pedido sem itens', () => {
    expect(
      () =>
        new Pedido(
          'pedido0004',
          clienteA,
          new Date(),
          StatusPedido.CARRINHO,
          enderecoClienteA,
          MetodoPagamento.PIX,
          '',
          [],
        ),
    ).toThrow(/menos.*item/i);
  });

  it('adiciona itens do mesmo produto e calcula valorTotal', () => {
    const itens = [
      new ItemPedido(produtoA, 1, D('100')),
      new ItemPedido(produtoA, 3, D('100')),
      new ItemPedido(produtoB, 2, D('60')),
    ];
    const pedido = new Pedido(
      'pedido05263',
      clienteA,
      new Date(),
      StatusPedido.CARRINHO,
      enderecoClienteA,
      MetodoPagamento.BOLETO,
      '',
      itens,
    );

    // 4*100 = 400 + 2*60 = 120; tot = 520
    expect(pedido.itens.length).toBe(2);
    const itemA = pedido.itens.find((i) => i.produto.id === 'produto0001')!;
    expect(itemA.quantidade).toBe(4);
    expect(pedido.valorTotal.toString()).toBe('520');
  });

  it('testa metodo adicionarItem no CARRINHO', () => {
    const pedido = new Pedido(
      'pedido015210',
      clienteB,
      new Date(),
      StatusPedido.CARRINHO,
      enderecoClienteB,
      MetodoPagamento.PIX,
      '',
      [new ItemPedido(produtoA, 1, D('100'))],
    );

    pedido.adicionarItem(new ItemPedido(produtoB, 2, D('60'))); // novo produto
    pedido.adicionarItem(new ItemPedido(produtoA, 3, D('100'))); // consolida A

    expect(pedido.itens.length).toBe(2);
    const a = pedido.itens.find((i) => i.produto.id === 'produto0001')!;
    expect(a.quantidade).toBe(4);
    expect(pedido.valorTotal.toString()).toBe('520');
  });

  it('testa metodo removerItem', () => {
    const pedido = new Pedido(
      'pedido541321',
      clienteA,
      new Date(),
      StatusPedido.CARRINHO,
      enderecoClienteA,
      MetodoPagamento.PIX,
      '',
      [
        new ItemPedido(produtoA, 1, D('100')),
        new ItemPedido(produtoB, 1, D('60')),
      ],
    );

    pedido.removerItem(produtoB);
    expect(pedido.itens.length).toBe(1);
    expect(pedido.itens[0]!.produto.id).toBe('produto0001');

    pedido.removerItem(pedido.itens[0]!);
    expect(pedido.itens.length).toBe(0);
  });

  it('testa metodo finalizarPedido', () => {
    const pedido = new Pedido(
      'pedido121510',
      clienteA,
      new Date(),
      StatusPedido.CARRINHO,
      enderecoClienteA,
      MetodoPagamento.PIX,
      '',
      [new ItemPedido(produtoA, 1, D('100'))],
    );

    pedido.finalizarPedido(MetodoPagamento.CARTAO);
    expect(pedido.status).toBe(StatusPedido.AGUARDANDO_PAGAMENTO);
    expect(pedido.metodoPagamento).toBe(MetodoPagamento.CARTAO);

    expect(() =>
      pedido.adicionarItem(new ItemPedido(produtoB, 1, D('60'))),
    ).toThrow(/alterar itens/i);
    expect(() => pedido.removerItem(produtoA)).toThrow(/alterar itens/i);
  });

  it('testando fluxo de status', () => {
    const pedido = new Pedido(
      'pedido015203',
      clienteA,
      new Date(),
      StatusPedido.CARRINHO,
      enderecoClienteA,
      MetodoPagamento.PIX,
      '',
      [new ItemPedido(produtoA, 1, D('21343'))],
    );

    pedido.finalizarPedido(MetodoPagamento.PIX);
    expect(pedido.status).toBe(StatusPedido.AGUARDANDO_PAGAMENTO);

    pedido.confirmarPagamento();
    expect(pedido.status).toBe(StatusPedido.PAGO);

    pedido.enviarPedido();
    expect(pedido.status).toBe(StatusPedido.ENVIADO);

    pedido.concluirPedido();
    expect(pedido.status).toBe(StatusPedido.CONCLUIDO);
  });

  it('falha ao tentar enviar antes do pagamento', () => {
    const pedido = new Pedido(
      'pedido321320',
      clienteA,
      new Date(),
      StatusPedido.CARRINHO,
      enderecoClienteA,
      MetodoPagamento.CARTAO,
      '',
      [new ItemPedido(produtoB, 3, D('1650'))],
    );

    pedido.finalizarPedido(MetodoPagamento.CARTAO);
    expect(() => pedido.enviarPedido()).toThrow(/pago/i);
  });

  it('falha ao tentar enviar deve falhar', () => {
    const pedido = new Pedido(
      'pedido0032',
      clienteA,
      new Date(),
      StatusPedido.CARRINHO,
      enderecoClienteA,
      MetodoPagamento.BOLETO,
      '',
      [new ItemPedido(produtoA, 1, D('100'))],
    );

    pedido.finalizarPedido(MetodoPagamento.BOLETO);
    pedido.confirmarPagamento();
    expect(() => pedido.concluirPedido()).toThrow(/enviado/i);
  });

  it('nao pode cancelar se o pedido foi concluído, apenas no carrinho', () => {
    const p1 = new Pedido(
      'pedido00042',
      clienteA,
      new Date(),
      StatusPedido.CARRINHO,
      enderecoClienteA,
      MetodoPagamento.BOLETO,
      '',
      [new ItemPedido(produtoA, 1, D('100'))],
    );
    p1.cancelar('desisti do produto');
    expect(p1.status).toBe(StatusPedido.CANCELADO);

    const p2 = new Pedido(
      'pedido00043',
      clienteA,
      new Date(),
      StatusPedido.CARRINHO,
      enderecoClienteA,
      MetodoPagamento.PIX,
      '',
      [new ItemPedido(produtoA, 1, D('100'))],
    );
    p2.finalizarPedido(MetodoPagamento.PIX);
    p2.confirmarPagamento();
    p2.enviarPedido();
    p2.concluirPedido();
    expect(() =>
      p2.cancelar('cancelamento deve ser feito antes do envio'),
    ).toThrow(/conclu[ií]do/i);
  });
});
