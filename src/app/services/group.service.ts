import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private firestore: AngularFirestore) { }

  createGroup(group) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("groups")
        .add(group)
        .then(res => { resolve() }, err => reject(err));
    });
  }

  getGroups() {
    return this.firestore.collection("coffeeOrders").snapshotChanges();
  }
}
