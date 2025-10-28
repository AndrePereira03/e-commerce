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
    ).toThrow(/id já existente/i);
  });
});

/*
  it('permite criar pedidos com IDs diferentes', () => {
    const a = new Pedido(
      'pedido0001',
      cliente,
      new Date(),
      StatusPedido.CARRINHO,
      endereco,
      MetodoPagamento.PIX,
      '',
      item,
    );
    const b = new Pedido(
      'pedido0002',
      cliente,
      new Date(),
      StatusPedido.CARRINHO,
      endereco,
      MetodoPagamento.PIX,
      '',
      item,
    );
    expect(a.id).not.toBe(b.id);
  });

  it('rejeita criar pedidos com IDs iguais', () => {
    new Pedido(
      'pedido0001',
      cliente,
      new Date(),
      StatusPedido.CARRINHO,
      endereco,
      MetodoPagamento.PIX,
      '',
      item,
    );
    expect(
      () =>
        new Pedido(
          'pedido0001',
          cliente,
          new Date(),
          StatusPedido.CARRINHO,
          endereco,
          MetodoPagamento.PIX,
          '',
          item,
        ),
    ).toThrow(/id já existente/i);
  });

  



});
*/
