// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле со значением веса
const minWeightInput = document.getElementById('minweight__input'); // поле с min весом
const maxWeightInput = document.getElementById('maxweight__input'); // поле с max весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// Массив значений цветов и их программных обозначений
const arrColor = [
  { color: "красный", nameColor: "red" },
  { color: "оранжевый", nameColor: "orange" },
  { color: "желтый", nameColor: "yellow" },
  { color: "зеленый", nameColor: "green" },
  { color: "голубой", nameColor: "lightblue" },
  { color: "синий", nameColor: "blue" },
  { color: "фиолетовый", nameColor: "violet" }
];

// Формируем выпадающий список возможных цветов для добавляемого фрукта
for (let i = 0; i < arrColor.length; i++) {
 let newOption = new Option(arrColor[i].color);
 colorInput.appendChild(newOption);
} 

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Саподилла", "color": "оранжевый", "weight": 22}
]`; 

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
minWeightInput.value = 0;
maxWeightInput.value = 0;
const display = () => {
  // очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из dispArray
  var elementsDel = document.getElementsByClassName("fruit__item");
  while (elementsDel.length > 0) {
    elementsDel[0].parentNode.removeChild(elementsDel[0]);
  }
  for (let i = 0; i < fruits.length; i++) {
    // формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    let newLi = document.createElement('li');
    let fruitColorName = "fruit_";
    for (let j = 0; j < arrColor.length; j++) {
       if (fruits[i].color === arrColor[j].color) {
        fruitColorName += arrColor[j].nameColor;
       }
    }
    newLi.classList.add("fruit__item", fruitColorName);
    fruitsList.appendChild(newLi);
    newDiv = document.createElement('div');
    newDiv.classList.add("fruit__info");
    newLi.appendChild(newDiv);
    let curFruitDiv = document.createElement('div');
    curFruitDiv.innerHTML = `Индекс=${i}`;
    newDiv.appendChild(curFruitDiv);
    curFruitDiv = document.createElement('div');
    curFruitDiv.innerHTML = `Название: ${fruits[i].kind}`;
    newDiv.appendChild(curFruitDiv);
    curFruitDiv = document.createElement('div');
    curFruitDiv.innerHTML = `Цвет: ${fruits[i].color}`;
    newDiv.appendChild(curFruitDiv);
    curFruitDiv = document.createElement('div');
    curFruitDiv.innerHTML = `Вес (кг): ${fruits[i].weight}`;
    newDiv.appendChild(curFruitDiv);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// функция перемешивания массива: находим случайный элемент из fruits, используя getRandomInt,
// вырезаем его из fruits и вставляем в result.
const shuffleFruits = () => {
  let isChangArr = false;  // isChangArr показывает, был ли массив изменен при перемешивании
  let result = [];
  while (fruits.length > 0) {
    let curNumber = getRandomInt(0, fruits.length - 1);
    if (curNumber > 0) {
      // если хотя бы раз вырезаемый элемент был не из начала массива, то массив изменился
      isChangArr = true;
    }
    result.push(fruits[curNumber]);
    fruits.splice(curNumber, 1);
  }
  if (!isChangArr) {
    alert("Порядок фруктов после перемешивания не изменился!");
  }
  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  // Обнуляем фильтрацию
  minWeightInput.value = 0;
  maxWeightInput.value = 0;
  display();
});

// Фильтрация массива
filterButton.addEventListener('click', () => {
  let minWeight = 0;
  let maxWeight = 0;
  // Проверка корректности заданных границ веса
  if (typeof minWeightInput.value != `number`) {
    minWeight = parseFloat(minWeightInput.value);
  } else {
    minWeight = minWeightInput.value;
  }
  if (typeof maxWeightInput.value != `number`) {
    maxWeight = parseFloat(maxWeightInput.value);
  } else {
    maxWeight = maxWeightInput.value;
  }
  if (minWeight < 0 || maxWeight <= 0 || minWeight > maxWeight) {
    alert("Некорректно задан диапазон фильтрации! Повторите ввод.");
  } else {
    // Запоминаем неотфильтрованный массив
    const oldFruits = fruits;
    fruits = fruits.filter(el => {
      const weight = el.weight;
      return weight >= minWeight && weight <= maxWeight;
    });
    display();
    fruits = oldFruits;
  }
});

/*** СОРТИРОВКА ***/
let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

// Функция сравнения двух элементов по цвету (порядок определяется по цветам радуги)
const comparationColor = (color1, color2) => {
  let ind = 0;
  let index1 = 0;
  let index2 = 0;
  do {
    if (arrColor[ind].color === color1) {
      index1 = ind;
    }
    if (arrColor[ind].color === color2) {
      index2 = ind;
    }
    ind++;
  } while ((index1 === 0 || index2 === 0) && ind < arrColor.length);
  return index2 < index1 ? true : false;
};

const partition = (arr, left, right, comparation) => {
  var pivot = arr[Math.floor((right + left) / 2)].color;
      i = left;
      j = right;
  while (i <= j && i < arr.length) {
      while (!comparation(arr[i].color, pivot)) {
          i++;
      }
      while (comparation(arr[j].color, pivot)) {
          j--;
      }
      if (i <= j) {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        i++;
        j--;
      }
  }
  return i;
}

const sortAPI = {
  bubbleSort(arr, comparation) {
    // Функция сортировки пузырьком
    const n = arr.length;
    // внешняя итерация по элементам
    for (let i = 0; i < n-1; i++) { 
        // внутренняя итерация для перестановки элемента в конец массива
        for (let j = 0; j < n-1-i; j++) { 
            // сравниваем элементы
            if (comparation(arr[j].color, arr[j+1].color)) { 
                // делаем обмен элементов
                let temp = arr[j+1]; 
                arr[j+1] = arr[j]; 
                arr[j] = temp; 
            }
        }
    }                   

  },

  quickSort(arr, comparation, left, right) {
    // Функция быстрой сортировки
    let index;
    if (arr.length > 1) {
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? arr.length - 1 : right;
        index = partition(arr, left, right, comparation);
        if (left < index - 1) {
            sortAPI.quickSort(arr, comparation, left, index - 1);
        }
        if (index < right) {
            sortAPI.quickSort(arr, comparation, index, right);
        }
    }
    return arr;
  },
  
  startSort(sort, arr, comparation) {
    // функция выполняет сортировку и производит замер времени
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  }
};

// инициализация полей
sortKindLabel.textContent = (sortKind === 'bubbleSort') ? 'Пузырьковая сортировка' : 'Быстрая сортировка';;
sortTimeLabel.textContent = sortTime;

  // Функция переключает значение sortKind между 'bubbleSort' / 'quickSort'
sortChangeButton.addEventListener('click', () => {
  sortKind = (sortKind === 'bubbleSort') ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = (sortKind === 'bubbleSort') ? 'Пузырьковая сортировка' : 'Быстрая сортировка';
})

// Нажатие на кнопку "Сортировать"
sortActionButton.addEventListener('click', () => {
  // Обнуляем фильтрацию
  minWeightInput.value = 0;
  maxWeightInput.value = 0;
  if (sortKind === `bubbleSort`) {
    const sort = sortAPI[sortKind];
    sortAPI.startSort(sort, fruits, comparationColor);
    display();
    sortTimeLabel.textContent = sortTime;
  } else {
    alert ("Метод быстрой сортировки не реализован в программе");
    sortTime = '-';
  }
})

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // Проверка корректности введенных характеристик нового фрукта
  if (kindInput.value == "" || colorInput.value == "" || weightInput.value <= 0) {
    alert("Недопустимые характеристики фрукта! Повторите ввод");
  } else {
      // создание и добавление нового фрукта в массив fruits
      // необходимые значения берем из kindInput, colorInput, weightInput
      fruits.push({"kind": kindInput.value, "color": colorInput.value, "weight": weightInput.value});
      kindInput.value = "";
      colorInput.value = "";
      weightInput.value = 0;
      // Обнуляем фильтрацию
      minWeightInput.value = 0;
      maxWeightInput.value = 0;
      display();
  }
})
