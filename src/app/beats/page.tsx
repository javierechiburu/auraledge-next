import { redirect } from "next/navigation";

// La colección de beats ahora vive como un menú dinámico en /c/beats.
// Se mantiene /beats por compatibilidad con enlaces antiguos.
export default function BeatsPage() {
  redirect("/c/beats");
}
