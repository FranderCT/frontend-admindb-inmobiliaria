import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/403')({
  component: RouteComponent,
})

function RouteComponent() {
  return <section className=' h-full w-full flex justify-center items-center'>
    <div className="page-wrap">
      <div className="page-not-found">
        <img src="https://res.cloudinary.com/razeshzone/image/upload/v1588316204/house-key_yrqvxv.svg"
          className="img-key" alt="" />

        <h1 className="text-grande">
          <span>4</span>
          <span>0</span>
          <span className="broken">3</span>
        </h1>
        <div className='w-full'><h4 className="text-mediano">Acceso denegado</h4></div>
        <h4 className="text-peq text-peq-btm">No tienes acceso a esta área de la aplicación.
          Habla con tu administrador para desbloquear esta función.
          Puedes volver a la <Link href="/">página principal</Link>.
        </h4>
      </div>
    </div>
  </section>
}
