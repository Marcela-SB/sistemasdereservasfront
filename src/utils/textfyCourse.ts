import { Courses } from "../types/Courses";

export default function textfyCourse( course: Courses ){
    switch (course) {
        case Courses.TEATRO:
            return 'Teatro'
        case Courses.ARTES:
            return 'Artes Visuais'
        case Courses.DESING:
            return 'Desing'
        case Courses.DANÇA:
            return 'Dança'
        case Courses.POS:
                return 'Pós'
        default:
            return 'Sem curso relacionado'
    }
}