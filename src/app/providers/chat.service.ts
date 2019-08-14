import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from'rxjs/operators';
// <--Interface-->
import  { Mensaje } from'../interface/mensaje.interface';
// login
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  

  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor( private afs: AngularFirestore,
              public afAuth: AngularFireAuth ) {

                this.afAuth.authState.subscribe( user => {} )
  }
  login( proveedor: string) {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut(); }

  cargarMensajes() {

    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha','desc')
                                                        .limit(5) );

    return this.itemsCollection.valueChanges().pipe(map( (mensajes:Mensaje[]) =>{
                                  console.log( mensajes );
                                  //this.chats = mensajes;

                                  this.chats = [] ;
                                  for( let mensaje of mensajes ) {
                                    this.chats.unshift (mensaje);
                                  }
                                  return this.chats;
                                }))
  }
 // TODO falta el UID del usuario
  
  agregarMensaje( texto: string ) {

 
  let mensaje: Mensaje = {
    nombre: 'Demo',
    mensaje: texto,
    fecha: new Date().getTime()
  }
  return this.itemsCollection.add( mensaje );
  }
}
