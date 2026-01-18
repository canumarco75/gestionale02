import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { Office } from './office.entity';

@Entity({ name: 'employees' })
export class Employee {
  @PrimaryColumn({ type: 'int', name: 'employeeNumber' })
  employeeNumber: number;

  @Column({ type: 'varchar', length: 50, name: 'lastName' })
  lastName: string;

  @Column({ type: 'varchar', length: 50, name: 'firstName' })
  firstName: string;

  @Column({ type: 'varchar', length: 10, name: 'extension' })
  extension: string;

  @Column({ type: 'varchar', length: 100, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 10, name: 'officeCode' })
  officeCode: string;

  @Column({ type: 'int', name: 'reportsTo', nullable: true })
  reportsTo?: number | null;

  @Column({ type: 'varchar', length: 50, name: 'jobTitle' })
  jobTitle: string;

  @ManyToOne(() => Employee, (employee) => employee.directReports)
  @JoinColumn({ name: 'reportsTo' })
  manager?: Employee | null;

  @OneToMany(() => Employee, (employee) => employee.manager)
  directReports: Employee[];

  @ManyToOne(() => Office, (office) => office.employees)
  @JoinColumn({ name: 'officeCode' })
  office: Office;

  @OneToMany(() => Customer, (customer) => customer.salesRep)
  customers: Customer[];
}
