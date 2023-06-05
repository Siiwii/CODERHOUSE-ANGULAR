import { Estudiante } from "../../alumnos/models/index";
import { Curso } from "../../cursos/models";
import { Subject } from "../../subjects/models";

export interface Inscripcion {
  id: number;
  studentId: number;
  courseId: number;
  subjectId: number;
  dateInscription: Date;
}

export interface InscripcionWithStudent extends Inscripcion {
  student: Estudiante;
}

export interface InscripcionWithSubject extends Inscripcion {
  subject: Subject;
}

export interface InscripcionWithCourse extends Inscripcion {
  course: Curso;
}

export interface CreateInscripcionData {
  studentId: number;
  courseId: number;
  subjectId: number;
  dateInscription: Date;
}

export interface InscripcionWithAll extends InscripcionWithStudent, InscripcionWithSubject, InscripcionWithCourse {
  dateInscription: Date;
}
