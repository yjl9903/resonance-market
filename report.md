# 数据上报格式

## 单次上传

在 `${url}/api/log` 这一 endpoint 上, 接受 POST 请求，请求体为 JSON 格式的对象, 包含以下字段:

```TypeScript
{
    "name": ProductName,
    "sourceCity": CityName,
    "targetCity": CityName,
    "type": "buy" | "sell",
    "trend": "up" | "same" | "down",
    "price": number,
    "percent": number,
    "uploadedAt": number
}
```

其中 `ProductName` 为商品名称, `CityName` 为城市名称, 可在 [全商品表格](./scripts/全商品统计.csv) 中查看

`price` 为价格(整数), `percent` 为价格显示百分比(例如 `112`, 而非 `1.2`), `uploadedAt` 为上传 UNIX 时间戳, 单位为毫秒

以下为一个示例

```JSON
{
    "name": "防弹背心",
    "percent": 110,
    "price": 3225,
    "sourceCity": "铁盟哨站",
    "targetCity": "修格里城",
    "trend": "up",
    "type": "sell",
    "uploadedAt": 1710595468922
}
```

### 响应

预期响应为 `200 OK`, 响应体为

```JSON
{
    "count": 1
}
```

## 批量上传

在 `${url}/api/logs` 这一 endpoint 上, 接受 POST 请求，请求体为 JSON 格式的列表, 列表中每一个对象与单次上传的格式相同:

```TypeScript
[
    {
        "name": ProductName,
        "sourceCity": CityName,
        "targetCity": CityName,
        "type": "buy" | "sell",
        "trend": "up" | "same" | "down",
        "price": number,
        "percent": number,
        "uploadedAt": number
    },
    ...
]
```

各字段含义与单次上传相同

### 响应

预期响应为 `200 OK`, 响应体为

```TypeScript
{
    "count": number
}
```

其中 `count` 为成功上传的数据条数

