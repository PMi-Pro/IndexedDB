const form = document.querySelector("form");
const submit = document.querySelector(".submit");
const updates = document.querySelector(".update");
const tbody = document.querySelector("table>tbody");

const dbName = "PMiDB";

let init = indexedDB.open(dbName, 1)
init.onupgradeneeded = () => {
  let res = init.result;
  res.createObjectStore('data', { autoIncrement: true });
  alert("Đã tạo cơ sở dữ liệu!");
}

read();

submit.addEventListener('click', () => {
  let idb = indexedDB.open(dbName, 1);
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
    alert("Đã thêm dữ liệu!")
    read();
    form[0].value = null;
    form[1].value = null;
    form[2].value = null;
    form[3].value = null;
  }
});

function read() {
  tbody.innerHTML = null;
  let idb = indexedDB.open(dbName, 1)
  idb.onsuccess = () => {
    let res = idb.result;
    let tx = res.transaction('data', 'readonly');
    let store = tx.objectStore('data')
    let cursor = store.openCursor();
    cursor.onsuccess = () => {
      let curRes = cursor.result;
      if (curRes) {
        tbody.innerHTML += `
                <tr onclick="tableItemTap(this)">
                  <td>${curRes.value.name}</td>
                  <td>${curRes.value.email}</td>
                  <td>${curRes.value.phone}</td>
                  <td>${curRes.value.address}</td>
                  <td onclick="update(${curRes.key})" style="background-color: lightgray;">Sửa</td>
                  <td onclick="del(${curRes.key})" style="background-color: lightgray;">Xoá</td>
                </tr>
                `;
        curRes.continue()
      }
    }
  }
}

function del(e) {
  let idb = indexedDB.open(dbName, 1)
  idb.onsuccess = () => {
    let res = idb.result;
    let tx = res.transaction('data', 'readwrite')
    let store = tx.objectStore('data')
    store.delete(e)
    alert("Đã xoá!");
    read();
  }
}

let updateKey;

function update(e, a) {
  submit.style.display = "none";
  updates.style.display = "block";
  updateKey = e;
}

updates.addEventListener('click', () => {
  let idb = indexedDB.open(dbName, 1)
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
    alert("Đã cập nhật!");
    read();
    form[0].value = null;
    form[1].value = null;
    form[2].value = null;
    form[3].value = null;
    submit.style.display = "block";
    updates.style.display = "none";
  }
});
