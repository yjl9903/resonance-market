import json
import os
import requests
from env import uuid

# 特产商品名称列表
specialty_product_name_list = [
  '发动机',
  '弹丸加速装置',
  '红茶',
  '防弹背心',
  '精钢',
  '炮弹',
  '塑胶炸药',
  '桦石发财树',
  '石墨烯',
  '人工晶花',
  '斑节虾',
  '游戏机',
  '银矿石',
  '游戏卡带',
  '扬声器',
  '火澄石',
  '负片炮弹',
  '阿妮塔202军用无人机',
  '抗污染防护服',
  '钛合金',
  '碳纤维',
  '阿妮塔小型桦树发电机',
  '石墨烯电池',
  '阿妮塔101民用无人机',
  '家用太阳能电池组',
  '棉花',
  '孔雀石',
  '琥珀',
  '绿松石',
  '图形加速卡',
  '钛矿石',
  '铁轨用特种钢材',
  '曼德工具箱',
  '沙金',
  '青金石',
  '玛瑙'
]

# 手工制作商品名称列表
manufacture_product_name_list = [
  '修格里严选礼包',
  '年货大礼包',
  '金箔',
  '纯金线材'
]

# 手工制作商品所属城市映射
manufacture_product_fromcity_map = {
  '修格里严选礼包': '修格里城',
  '年货大礼包': '7号自由港',
  '金箔': '淘金乐园',
  '纯金线材': '淘金乐园'
}

# 生效的城市列表
valueable_city_name_list = [
  '修格里城',
  '铁盟哨站',
  '7号自由港',
  '澄明数据中心',
  '阿妮塔战备工厂',
  '阿妮塔能源研究所',
  '荒原站',
  '曼德矿场',
  '淘金乐园'
]

# 请求索思学会市场实时数据
print("开始获取索思学会数据……")
sisuo_data_response = requests.get(f"https://resonance.breadio.wiki/api/resodata/api/fetch/goods_info?uuid={uuid}", headers={ "User-Agent": "resonance-market" })
sisuo_data = sisuo_data_response.json()
print("获取索思学会数据成功")

# 将数据按type分类
sisuo_data_type_buy = []
sisuo_data_type_sell = {}
# 按type分类, buy和sell的主体是城市交易所
for item in sisuo_data:
  # 如果是交易所出售商品（列车长买入）或者是 手工制造商品且是其所属城市
  if item["type"] == "sell" or (item["name"] in manufacture_product_name_list and item["station"] == manufacture_product_fromcity_map[item["name"]]):
    sisuo_data_type_buy.append(item)
  elif item["type"] == "buy":
    # 按商品名称聚合
    if not sisuo_data_type_sell.get(item["name"]):
      sisuo_data_type_sell[item["name"]] = []
    sisuo_data_type_sell[item["name"]].append(item)

product_metadata = []
# 遍历buy数据
for buy_item in sisuo_data_type_buy:
  product_metadata_item = {
    "name": buy_item["name"],
    "city": buy_item["station"],
    "valuable": True if buy_item['name'] in specialty_product_name_list or buy_item['name'] in manufacture_product_name_list else False,
    "type": "specialty" if buy_item['name'] in specialty_product_name_list else "manufacture" if buy_item['name'] in manufacture_product_name_list else "normal",
    "baseVolume": buy_item["stock"],
    "basePrice": buy_item["base_price"],
    "transactions": [],
  }
  # 从sell数据中找到对应的商品
  if sisuo_data_type_sell.get(buy_item["name"]):
    for sell_item in sisuo_data_type_sell[buy_item["name"]]:
      product_metadata_item["transactions"].append({
        "name": sell_item["name"],
        "sourceCity": buy_item["station"],
        "targetCity": sell_item["station"],
        "basePrice": sell_item["base_price"],
        "mileage": 0,
        "valuable": True if sell_item["station"] in valueable_city_name_list else False,
      })
  
  product_metadata.append(product_metadata_item)


# 获取当前运行的 Python 文件的路径
current_path = os.path.dirname(os.path.abspath(__file__))
# 使用 os.path.join 来连接路径
json_file_path = os.path.join(current_path, "../utils/products.json")
# 将商品基准数据写入JSON文件，UTF-8编码
with open(json_file_path, "w", encoding="utf-8") as f:
  f.write(json.dumps(product_metadata, ensure_ascii=False, indent=2))
  print("商品基准数据写入成功")