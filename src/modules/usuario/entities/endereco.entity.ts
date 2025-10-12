import { Usuario } from './usuario.entity.ts';

export class Endereco {
  usuario: Usuario;
  logradouro: string;
  bairro: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
  cep: string;

  constructor(
    usuario: Usuario,
    logradouro: string,
    bairro: string,
    numero: string,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string,
  ) {
    this.usuario = usuario;
    this.logradouro = logradouro;
    this.bairro = bairro;
    this.numero = numero;
    this.complemento = complemento;
    this.cidade = cidade;
    this.estado = estado;
    this.cep = cep;

    if (!cepValido(cep)) throw new Error('CEP inválido.');
    if (!estadoValido(estado)) throw new Error('UF inválida.');
  }

  get formataLogradouro(): string {
    return `${this.logradouro}, ${this.numero}${
      this.complemento ? ' - ' + this.complemento : ''
    }`;
  }

  get formataBairroCEP(): string {
    return `${this.bairro} - ${this.cidade}/${this.estado}`;
  }
}

function cepValido(cep: string): boolean {
  return /^\d{5}-?\d{3}$/.test(cep); //aceita nnnnnnnn e nnnnn-nnn
}

function estadoValido(uf: string): boolean {
  const estados = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ];
  return estados.includes(uf.toUpperCase());
}
