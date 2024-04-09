import {Entity, Column, PrimaryColumn} from "typeorm";

type MealType = "breakfast" | "lunch" | "dinner"
type HaksikType = "haksik" | "snack" | "pro" | "riseF" | "riseS" | "poo"

export type {
    MealType,
    HaksikType
}



@Entity()
export class Menu {

    @PrimaryColumn({type : "varchar",length : 255})
    id!: string;

    @Column({type : "nvarchar", length : 50})
    mealType!: MealType;

    @Column({type  : "nvarchar", length : 50})
    haksikType : HaksikType

    @Column({ type: 'date'})
    date!: Date;

    @Column({type: "nvarchar",charset : "Korean_Wansung_Unicode_CI_AS",length : "max"})
    menus : string

}