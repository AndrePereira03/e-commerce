import { describe, it, expect } from 'vitest';
import { Usuario, Role } from '../modules/usuario/entities/usuario.entity.ts';

const hoje = new Date();
const dataPassada = new Date('2003-11-25');
const dataFutura = new Date(
  hoje.getFullYear() + 1,
  hoje.getMonth(),
  hoje.getDate(),
);
const dataMuitoAntiga = new Date(
  hoje.getFullYear() - 130,
  hoje.getMonth(),
  hoje.getDate(),
);

describe('Usuario', () => {
  it('cria cliente válido', () => {
    const u = new Usuario(
      '95497873626',
      'André Pereira',
      'andremartinsp2003@gmail.com',
      'senha123',
      dataPassada, // role omitido: default cliente
    );
    expect(u.nome).toBe('André Pereira');
    expect(u.email).toBe('andremartinsp2003@gmail.com');
    expect(u.role).toBe(Role.CLIENTE);

    if (typeof (u as any).isCliente === 'function')
      expect((u as any).isCliente()).toBe(true);

    if (typeof (u as any).isAdmin === 'function')
      expect((u as any).isAdmin()).toBe(false);
  });

  it('cria admin válido', () => {
    const u = new Usuario(
      '11144477735',
      'Administrador',
      'admin2025@gmail.com',
      'senhaSecreta',
      new Date('2004-02-17'),
      Role.ADMIN,
    );
    expect(u.role).toBe(Role.ADMIN);

    if (typeof (u as any).isAdmin === 'function')
      expect((u as any).isAdmin()).toBe(true);

    if (typeof (u as any).isCliente === 'function')
      expect((u as any).isCliente()).toBe(false);
  });

  it('rejeita e-mail inválido', () => {
    expect(
      () =>
        new Usuario(
          '95497873626',
          'André Pereira',
          'andremartinsp2003gmail.com', //teste sem @
          'secretCode',
          new Date('2002-09-22'),
        ),
    ).toThrow(/e-mail inv[áa]lido/i);
  });
});
