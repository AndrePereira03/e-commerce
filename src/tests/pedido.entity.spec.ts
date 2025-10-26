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

describe('Pedido - ID único', () => {
  const cliente = new Cliente(
    '95497873626',
    'André Pereira',
    'andre.pereira@estudante.ufjf.br',
    'senha1234',
    new Date('2003-11-25'),
  );
  const endereco = new Endereco(
    cliente,
    'Avenida Presidente Costa e Silva',
    'São Pedro',
    '10',
    'Casa',
    'JF',
    'MG',
    '36037000',
  );
  const produto = new Produto(
    'produto0001',
    'Computador',
    new Decimal('3540'),
    20,
  );
  const item = new ItemPedido(produto, 3, produto.preco);

  beforeEach(() => {
    Pedido.limparIDs();
  });

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
