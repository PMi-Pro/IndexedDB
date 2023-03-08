const form = document.querySelector("form");
const submit = document.querySelector(".submit");
const updates = document.querySelector(".update");
const tbody = document.querySelector("table>tbody");

submit.addEventListener('click', () => {
  let idb = indexedDB.open('crud', 1)
  idb.onupgradeneeded = () => {
    let res = idb.result;
    res.createObjectStore('data', { autoIncrement: true });
  }
  idb.onsuccess = () => {
    let res = idb.result;
    let tx = res.transaction('data', 'readwrite');
    let store = tx.objectStore('data')
    store.put({
      name: form[0].value,
      email: form[1].value,
      phone: form[2].value,
      address: form[3].value
    })
    alert("data has been added")
    location.reload()
  }
})

function read() {
  let idb = indexedDB.open('crud', 1)
  idb.onsuccess = () => {
    let res = idb.result;
    let tx = res.transaction('data', 'readonly');
    let store = tx.objectStore('data')
    let cursor = store.openCursor()
    cursor.onsuccess = () => {
      let curRes = cursor.result;
      if (curRes) {
        console.log(curRes.value.name);
        tbody.innerHTML += `
                <tr>
                  <td>${curRes.value.name}</td>
                  <td>${curRes.value.email}</td>
                  <td>${curRes.value.phone}</td>
                  <td>${curRes.value.address}</td>
                  <td onclick="update(${curRes.key})" style="background-color: silver;">Sửa</td>
                  <td onclick="del(${curRes.key})" style="background-color: silver;">Xoá</td>
                </tr>
                `;
        curRes.continue()
      }
    }
  }
}

function del(e) {
  let idb = indexedDB.open('crud', 1)
  idb.onsuccess = () => {
    let res = idb.result;
    let tx = res.transaction('data', 'readwrite')
    let store = tx.objectStore('data')
    store.delete(e)
    alert("Data has been deleted")
    location.reload()
  }
}

let updateKey;

function update(e) {
  submit.style.display = "none";
  updates.style.display = "block";
  updateKey = e;
}
updates.addEventListener('click', () => {
  let idb = indexedDB.open('crud', 1)
  idb.onsuccess = () => {
    let res = idb.result;
    let tx = res.transaction('data', 'readwrite')
    let store = tx.objectStore('data')
    store.put({
      name: form[0].value,
      email: form[1].value,
      phone: form[2].value,
      address: form[3].value
    }, updateKey);
    alert("data has been updated")
    location.reload()
  }
})

read()