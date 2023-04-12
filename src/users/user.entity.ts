import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  password: string

  // hooks
  // only works if create and then save
  // wont work if we save object directly

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id', this.id)
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id', this.id)
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user with id', this.id)
  }

}