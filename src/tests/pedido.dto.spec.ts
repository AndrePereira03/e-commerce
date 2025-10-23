import { describe, it, expect } from 'vitest';
import * as dec from 'decimal.js';
const DecimalCtor: any =
  (dec as any).default ?? (dec as any).Decimal ?? (dec as any);
const D = (v: any) => new DecimalCtor(v);

import { Cliente } from '../modules/usuario/entities/usuario.entity.ts';
import { Endereco } from '../modules/usuario/entities/endereco.entity.ts';
import { Produto } from '../modules/produto/entities/produto.entity.ts';
import { Pedido } from '../modules/pedido/entities/pedido.entity.ts';
import { StatusPedido } from '../modules/pedido/entities/pedido.entity.ts';
import { MetodoPagamento } from '../modules/pedido/entities/pedido.entity.ts';
import { CriarPedidoDTO } from '../modules/pedido/dtos/pedido.dto.ts';
import { toPedido } from '../modules/pedido/dtos/pedido.dto.ts';

describe('DTO → Pedido', () => {
  const cliente = new Cliente(
    '24485597679',
    'Andre Pereira',
    'andrepereira@gmail.com',
    'senha123',
    new Date('2003-11-25'),
  );
  const endereco = new Endereco(
    cliente,
    'Avenida Itamar Franco',
    'Centro',
    '10',
    'casa',
    'JF',
    'MG',
    '36000-000',
  );
  const p1 = new Produto('00086', 'Teclado', D('100.00'), 50);
  const p2 = new Produto('00087', 'Mouse', D('60.00'), 50);

  it('mapeia DTO completo para Pedido e calcula total', () => {
    const dto: CriarPedidoDTO = {
      id: 'pedido1',
      cliente,
      data: new Date('2025-10-22T21:08:00Z'),
      status: StatusPedido.CARRINHO,
      enderecoEntrega: endereco,
      metodoPagamento: MetodoPagamento.PIX,
      observacao: 'testandoPedido',
      itens: [
        { produto: p1, quantidade: 2, precoUnidade: '100.00' },
        { produto: p2, quantidade: 3, precoUnidade: '60.00' },
      ],
    };

    const pedido = toPedido(dto);
    expect(pedido).toBeInstanceOf(Pedido);
    expect(pedido.clienteCPF).toBe(cliente.cpf);
    expect(pedido.enderecoEntrega).toBe(endereco);
    expect(pedido.itens.length).toBe(2);
    expect(pedido.valorTotal.toString()).toBe('380');
  });

  it('lanca erro se nenhum item eh informado', () => {
    const dtoSemItens: CriarPedidoDTO = {
      id: 'pedido2',
      cliente,
      data: new Date(),
      status: StatusPedido.CARRINHO,
      enderecoEntrega: endereco,
      metodoPagamento: MetodoPagamento.CARTAO,
      observacao: '',
      itens: [],
    };
    expect(() => toPedido(dtoSemItens)).toThrow(
      /Ao menos um item deve ser informado/i,
    );
  });

  it('lanca erro se endereco nao pertence ao cliente', () => {
    const clienteErrado = new Cliente(
      '49444895602',
      'Iandra',
      'iandra@gmail.com',
      'senhaDificil',
      new Date('2004-02-17'),
    );
    const endClienteErrado = new Endereco(
      clienteErrado,
      'Avenida Presidente Costa e Silva',
      '2890',
      'ap 425',
      'São Pedro',
      'JF',
      'MG',
      '01000-000',
    );

    const dto: CriarPedidoDTO = {
      id: 'pedido3',
      cliente,
      data: new Date(),
      status: StatusPedido.CARRINHO,
      enderecoEntrega: endClienteErrado,
      metodoPagamento: MetodoPagamento.PIX,
      observacao: '',
      itens: [{ produto: p1, quantidade: 1, precoUnidade: '100.00' }],
    };

    expect(() => toPedido(dto)).toThrow(/Endereco nao pertence ao cliente/i);
  });
});
