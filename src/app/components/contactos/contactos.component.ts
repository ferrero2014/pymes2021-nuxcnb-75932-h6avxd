import { Component, OnInit } from '@angular/core';
import { ContactosService } from '../../services/contactos.service';
import { Contacto } from '../../models/contacto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css'],
})
export class ContactosComponent implements OnInit {
  Titulo = 'Contactos';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)',
  };
  accionABMC = 'L';
  contactos: Contacto[] = null;
  formRegistro: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private contactosService: ContactosService
  ) {}

  ngOnInit() {
    //Inicializamos el formulario reacctivo con sus campos y sus respectivos validadores
    this.formRegistro = this.formBuilder.group({
      IdContacto: [null],
      Nombre: [null, [Validators.required, Validators.maxLength(50)]],
      FechaNacimiento: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          ),
        ],
      ],
      Telefono: [null, [Validators.required, Validators.pattern('[0-9]{1,9}')]],
    });
  }
  //solicita al servicio de contactos todos los contactos de la base de datos y los guarda en una lista
  buscar() {
    this.contactosService.get().subscribe((res: Contacto[]) => {
      this.contactos = res;
    });
  }

  //solicita al servicio de contactos el contacto con la id que se pasa como parametro y lo muestra en el formulario
  buscarPorId(Dto, AccionABMC) {
    window.scroll(0, 0);
    this.accionABMC = AccionABMC;

    this.contactosService.getById(Dto.IdContacto).subscribe((res: any) => {
      const ItemCopy = { ...res }; //copiamos la respuesta para no modificar el array original

      //formateamos la fecha de iso 8061 a dd/mm/yyyy
      var arrFecha = ItemCopy.FechaNacimiento.substr(0, 10).split('-');
      ItemCopy.FechaNacimiento =
        arrFecha[2] + '/' + arrFecha[1] + '/' + arrFecha[0];
      this.formRegistro.patchValue(ItemCopy);
      //this.AccionABMC = AccionABMC;
    });
  }

  ////abre el formulario en modo alta y cierra el listado
  agregar() {
    this.accionABMC = 'A';
    this.formRegistro.reset({
      IdContacto: 0,
    });
  }

  //cierra el formulario y vuelve al listado
  volver() {
    this.accionABMC = 'L';
  }

  //abre el formulario en modo consulta y cierra el listado
  consultar(contacto) {
    this.buscarPorId(contacto, 'C');
  }

  //envia el nuevo contacto al servivio para que lo guarde en la base de datos, cierra el formulario y vuelve al listado
  grabar() {
    if (this.formRegistro.invalid) {
      return;
    }
    const itemCopy = { ...this.formRegistro.value };

    //convertimos la fecha de dd/mm/yyyy a ISO 8061
    var arrFecha = itemCopy.FechaNacimiento.substr(0, 10).split('/');
    if (arrFecha - length == 3) {
      itemCopy.FechaNacimiento = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();
    }

    //esto solo sirve para separar entre alta y modificacion, por eso esta comentado
    //if (this.accionABMC == 'A') {

    this.contactosService.post(itemCopy).subscribe((res: any) => {
      this.volver();
      alert('Registro agregado correctamente');
    });

    //esto solo sirve para hacer el modificar, por eso esta comentado
    /*} else {
      this.contactosService
        .put(itemCopy.IdArticulo, itemCopy)
        .subscribe((res: any) => {
          this.Volver();
          alert('Registro modificado correctamente');
        });
    }*/
  }
}
