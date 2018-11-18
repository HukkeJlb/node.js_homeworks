const path = require('path');

// имя директории исполняемого скрипта
console.log(__dirname);
// имя исполняемоrо скрипта (абсолютный путь)
console.log(__filename);

// преобразует заданный путь в относительный
console.log(path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'));

// преобразует заданный путь в абсолютный
console.log(path.resolve('/foo/bar', './baz'));

// «приводит пути в порядок•, то есть удаляет из них все, что там быть не должно, но появилось, например из-за специфичного формата ввода
console.log(path.normalize('/foo/bar//baz/asdf/quux/..'));
console.log(path.normalize('C:\\temp\\\\foo\\bar\\..\\'));

// позволяет распарсить путь к файлу
console.log(path.parse('/home/user/dir/file.txt'));

// позволяет соединять пути в файловой системе
console.log(path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'));

// определяем специфичный для платформы разделитель в пути к файлу:
console.log(path.sep);
