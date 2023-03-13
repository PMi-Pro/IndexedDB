const form = document.querySelector("form");
const addData = document.querySelector(".addData");
const updates = document.querySelector(".update");
const tbody = document.querySelector("table>tbody");

const dbName = "PMiDB";

let init = indexedDB.open(dbName, 1)
init.onupgradeneeded = () => {
  init.result.createObjectStore('data', { autoIncrement: true });
  alert("Chào Mừng Đến với PMi Web\nLưu Ý: Nếu xoá dữ liệu trang web hoặc bộ nhớ đệm, ứng dụng có thể sẽ mất hết dữ liệu");
}

addData.addEventListener('click', () => {
  if (form[0].value.length != 0 && form[1].value.length != 0 && form[2].value.length != 0 && form[3].value.length != 0)
  {
    let idb = indexedDB.open(dbName, 1)
    idb.onsuccess = () => {
      let store = idb.result.transaction('data', 'readwrite').objectStore('data');
      store.put({
        name: form[0].value,
        email: form[1].value,
        phone: form[2].value,
        address: form[3].value
      })
      alert(`Đã thêm ${form[0].value} vào cơ sở dữ liệu!`);
      layDuLieu();
      form[0].value = form[1].value = form[2].value = form[3].value = null;
    }
  }
  else alert("Xin nhập nội dung đầy đủ trước khi lưu!");
});

layDuLieu = () => {
  tbody.innerHTML = null;
  let idb = indexedDB.open(dbName, 1)
  idb.onsuccess = () => {
    let store = idb.result.transaction('data', 'readwrite').objectStore('data');
    let cursor = store.openCursor();
    cursor.onsuccess = () => {
      let curRes = cursor.result;
      if (curRes) {
        tbody.innerHTML += `
                <tr>
                  <td>${curRes.value.name}</td>
                  <td>${curRes.value.email}</td>
                  <td>${curRes.value.phone}</td>
                  <td>${curRes.value.address}</td>
                  <td onclick="update(${curRes.key})" style="background-color: lightgray;">Sửa</td>
                  <td onclick="del(${curRes.key})" style="background-color: lightgray;">Xoá</td>
                </tr>
                `;
        curRes.continue();
      }
    }
  }
}

del = (e) => {
  let idb = indexedDB.open(dbName, 1);
  idb.onsuccess = () => {
    let store = idb.result.transaction('data', 'readwrite').objectStore('data');
    let obj = store.get(e);
    obj.onsuccess = () => {
      let check = confirm(`Xoá:  ${obj.result.name}\n\nNhấn OK để xoá`);
      if (check)
      {
        store.delete(e);
        layDuLieu();
      }
    }
  }
}

let updateKey;

update = (e) => {
  addData.style.display = "none";
  updates.style.display = "block";
  updateKey = e;
  let idb = indexedDB.open(dbName, 1)
  idb.onsuccess = () => {
    let store = idb.result.transaction('data', 'readwrite').objectStore('data').get(e);
    store.onsuccess = () => {
      form[0].value = store.result.name;
      form[1].value = store.result.email;
      form[2].value = store.result.phone;
      form[3].value = store.result.address;
    }
  }
}

updates.addEventListener('click', () => {
  if (form[0].value.length != 0 && form[1].value.length != 0 && form[2].value.length != 0 && form[3].value.length != 0)
  {
    let idb = indexedDB.open(dbName, 1)
    idb.onsuccess = () => {
      let store = idb.result.transaction('data', 'readwrite').objectStore('data');
      store.put({
        name: form[0].value,
        email: form[1].value,
        phone: form[2].value,
        address: form[3].value
      }, updateKey);
      alert(`Đã cập nhật thành ${form[0].value}`);
      layDuLieu();
      form[0].value = form[1].value = form[2].value = form[3].value = null;
      addData.style.display = "block";
      updates.style.display = "none";
    }
  }
  else alert("Xin nhập nội dung cần cập nhật!");
});

layDuLieu();
