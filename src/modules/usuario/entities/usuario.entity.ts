export enum Role {
  CLIENTE = 'CLIENTE',
  ADMIN = 'ADMIN',
}

export class Usuario {
  cpf: string;
  nome: string;
  email: string;
  senha: string;
  dataNascimento: Date;
  role: Role;

  constructor(
    cpf: string,
    nome: string,
    email: string,
    senha: string,
    dataNascimento: Date,
    role: Role = Role.CLIENTE,
  ) {
    this.cpf = cpf;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.dataNascimento = dataNascimento;
    this.role = role;

    if (!emailValido(email)) throw new Error('E-mail inváilido.');
    if (!cpfValido(cpf)) throw new Error('CPF inválido.');
    if (!nascimentoValido(dataNascimento))
      throw new Error('Data de nascimento inválida.');
  }

  isAdmin(): boolean {
    return this.role == Role.ADMIN;
  }

  isCliente(): boolean {
    return this.role == Role.CLIENTE;
  }
  fazerLogin(): void {
    /*implementarei qdo for mexer com auth */
  }
}

export class Administrador extends Usuario {
  nivelPermissao: string;

  constructor(
    cpf: string,
    nome: string,
    email: string,
    senha: string,
    dataNascimento: Date,
    nivelPermissao: string = 'PADRAO',
  ) {
    super(cpf, nome, email, senha, dataNascimento, Role.ADMIN);
    this.nivelPermissao = nivelPermissao;
  }

  editarProduto(produtoID: string): void {
    //depois
  }

  atualizarStatusPedido(pedidoID: string): void {
    //depois
  }
}

export class Cliente extends Usuario {
  constructor(
    cpf: string,
    nome: string,
    email: string,
    senha: string,
    dataNascimento: Date,
  ) {
    super(cpf, nome, email, senha, dataNascimento, Role.CLIENTE);
  }
}

function emailValido(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function nascimentoValido(d: Date): boolean {
  const hoje = new Date();
  if (d > hoje) return false;
  const idade =
    hoje.getFullYear() -
    d.getFullYear() -
    (hoje < new Date(hoje.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
  return idade >= 0 && idade <= 120;
}

function cpfValido(cpf: string): boolean {
  const s = cpf.replace(/\D/g, '');
  if (s.length !== 11 || /^(\d)\1{10}$/.test(s)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += parseInt(s[i]!, 10) * (len + 1 - i);
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };
  const d1 = calc(9);
  const d2 = calc(10);
  return d1 === parseInt(s[9]!, 10) && d2 === parseInt(s[10]!, 10);
}
