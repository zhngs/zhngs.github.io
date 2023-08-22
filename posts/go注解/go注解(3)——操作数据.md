---
date: '2022-05-05'
---

# 一.数组

## 1.声明

```go
var a [3]int = [3]int{1, 2, 3} //通用声明
a := [...]int{1, 2, 3} //效果和上面相同，三个点号代表自动计算长度
a := [...]int{99: -1} //100个元素，最后一个元素为-1，其他的都为0
x := a[len(a)-1] //内置函数len可以得到数组长度
```

# 二.切片

## 1.声明

- s[i:j]（其中0 <= i <= j <= cap(s)）可以生成切片，这里的s可以是数组，数组指针，slice

- 可以使用内置函数make来创建切片，`make(T[], len, cap)`，cap参数可以省略，当省略时len和cap相等

- note：slice之间无法使用==作比较，无法作为map的key

## 2.增删改查

- 增，append的原理是如果slice内部仍有空间，扩展slice内容，如果没有空间，就新建一个容量是原来二倍的slice，并将原来内容拷贝到新slice
  
  ```go
  var x []int
  x = append(x, 1) //使用内置函数append来追加数据
  x = append(x, 1, 2, 3) //可以同时追加多个数据
  ```

- 删，可以模拟出pop和remove的效果
  
  ```go
  x = x[:len(x)-1] //pop
  func remove(slice []int, i int) []int {
      copy(slice[i:], slice[i+1:])
      return slice[:len(slice)-1]
  }
  ```

- 改和查直接在原地修改就可以

# 三.字典

## 1.声明

- 可以使用内置函数make来创建一个map，也可以直接创建一个拥有字面量的map
  
  ```go
  a := make(map[string]int)
  a := map[string]int {
      "hello": 1,
      "world": 2,
  }
  a := map[string]int{} //空map，需要注意此时并不等于nil
  ```

## 2.增删改查

- 增，通过下标访问的方式，如果键不在map中，会得到value对应的零值，如果键在map中，则会返回value值。通过上述特性可以向map中添加新值
  
  ```go
  a["alice"] = 3
  ```

- 删，通过内置函数delete来删除指定键值对，即使该键不存在也是安全的
  
  ```go
  delete(a, "alice")
  ```

- 改，借助下标访问可以达到更新的效果
  
  ```go
  a["alice"] = 5
  ```

- 查，使用类似下标访问的方式，但是需要多加一个bool值
  
  ```go
  if v, ok := a["alice"]; !ok {
      //如果该键不存在
  }
  ```

# 四.字符串

## 1.基础操作

- 通过s[i:j]可以生成一个新的字符串，为原来字符串的子串

- 字符串可以使用==和<进行比较，比较使用字节进行，按照字典序排序

- 字符串可以使用+和+=进行拼接

- 原生的字符串字面量使用一对反引号书写，反引号内部的转义序列不起作用

- note：字符串访问越界程序会panic；字符串的第n的字节不一定是第n个字符，因为一个UTF码点可以需要多个字节；字符串字面量永远不能改变

## 2.相关函数

### 2.1 strings

- `func Contains(s, substr string) bool`，判断s中是否包含substr

- `func Join(a []string, seq string) string`，把slice通过seq来连接

- `func Index(s, seq string) int`，在字符串中查找seq所在位置，找不到返回-1

- `func Repeat(s string, count int) string`，重复s字符串count次

- `func Replace(s, old, new string, n int) string`，把s字符串中的old字符串替换成new字符串，n表示替换的次数，小于0表示全部替换

- `func Split(s, seq string) []string`，把s字符串按照seq分割，返回slice

- `func Trim(s string, cutset string) string`，在s头部和尾部去除cutset字符串 

- `func Fields(s string) []string`，将s按照空白字符分割(可以是一个或连续的空白字符)，返回slice

## 2.2 strconv

- `func AppendInt(dst []byte, i int64, base int) []byte`，将i按照base进制追加到dst

- `func FormatInt(i int64, base int) string`，返回i的base进制的字符串表示。base 必须在2到36之间，结果中会使用小写字母'a'到'z'表示大于10的数字

- `func ParseInt(s string, base int, bitSize int) (i int64, err error)`，返回字符串表示的整数值，接受正负号。base指定进制（2到36），如果base为0，则会从字符串前置判断，"0x"是16进制，"0"是8进制，否则是10进制；bitSize指定结果必须能无溢出赋值的整数类型，0、8、16、32、64 分别代表 int、int8、int16、int32、int64
