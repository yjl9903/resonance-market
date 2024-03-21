from datetime import datetime
import requests
import time
from env import uuid

local_dev = False
base_url = "http://localhost:3000" if local_dev else "https://resonance.breadio.wiki"

# 从所有商品基准数据中筛选出所有需要上报的商品，并转换为交易元数据
def product_metadata_to_transaction_meatadata(product_metadata=[]):
  # 初始化交易元数据
  transaction_meatadata = []
  # 特殊多城市买入商品价格
  special_multi_city_buy_product = ["弹丸加速装置"]
  # 遍历商品基准数据
  for product in product_metadata:
    # 如果商品不是要展示的，则跳过
    if not product["valuable"]:
      continue
    # 添加买入交易元数据
    transaction_meatadata.append({
      "name": product["name"], # 商品名称
      "base_price": product["basePrice"], # 商品基础价格
      "sourceCity": product["city"], # 商品买入城市
      "targetCity": product["city"], # 商品售卖城市（买入时与买入城市相同）
      "type": "buy", # 商品交易类型
    })
    # 遍历商品交易元数据
    for transaction in product["transactions"]:
      # 如果此交易链路不是要展示的，则跳过
      if not transaction["valuable"]:
        continue
      # 添加售出交易元数据
      transaction_meatadata.append({
        "name": product["name"], # 商品名称
        "base_price": transaction["basePrice"], # 商品基础价格
        "sourceCity": product["city"], # 商品买入城市
        "targetCity": transaction["targetCity"], # 商品售卖城市
        "type": "sell", # 商品交易类型
      })

    # 如果商品是特殊多城市买入商品
    if product["name"] in special_multi_city_buy_product:
      # 筛选出商品名称相同但买入城市不同的商品元数据
      same_name_diffrent_city_products = [item for item in product_metadata if (item["name"] == product["name"] and item["city"] != product["city"])]
      # 遍历添加相互售卖的商品交易元数据
      for item in same_name_diffrent_city_products:
        transaction_meatadata.append({
          "name": product["name"], # 商品名称
          "base_price": item["basePrice"], # 其他可买入城市的商品基础价格
          "sourceCity": product["city"], # 商品当前买入城市
          "targetCity": item["city"], # 商品其他可买入城市
          "type": "sell", # 商品交易类型
        })

  return transaction_meatadata

# 根据交易元数据，从索思学会数据中包装出需要上报的商品交易实时数据
def filter_products_to_upload(sisuo_data=[], transaction_meatadata=[], product_latestdata=[]):
  # 初始化需要上传的商品交易实时数据
  to_upload_transaction_data = []
  # 初始化价格未发生变化的商品数量
  no_change_data_count = 0
  # 筛选出需要上报的所有商品名称
  product_name_list = list(set([item["name"] for item in transaction_meatadata]))
  # 从索思学会数据中，根据需要上报的所有商品名称筛选出所有需要上报的商品实时数据
  to_upload_sisuo_data = [item for item in sisuo_data if item["name"] in product_name_list]

  # 将需要上报的思索实时数据转为 Key值为 商品名称-城市 的字典，方便后续查找
  sisuo_data_dict = {}
  for item in to_upload_sisuo_data:
    sisuo_data_dict[f"{item['name']}-{item['station']}"] = item
  
  # 将当前市场最新上报数据转为 Key值为 商品名称-城市 的字典，方便后续对比数据是否有变化
  product_latestdata_dict = {}
  for item in product_latestdata:
    product_latestdata_dict[f"{item['name']}-{item['targetCity']}"] = item
  
  # 根据交易数据、索思学会需上报数据，得出所有需要上报的商品交易实时数据
  for item in transaction_meatadata:
    data_key = f"{item['name']}-{item['targetCity']}" # 商品名称和城市的组合key
    target_sisuo_data = sisuo_data_dict.get(data_key) # 根据商品名称和城市的组合key从索思学会需上报数据中获取商品价格实时数据
    target_product_latestdata = product_latestdata_dict.get(data_key) # 根据商品名称和城市的组合key从当前市场最新上报数据中获取商品价格实时数据
    # 如果商品名称和城市的组合key在索思学会需上报数据中不存在，则跳过
    if not target_sisuo_data:
      print(f"({data_key})在索思学会数据中不存在")
      continue
    # 如果商品价格为-1，表示该商品在该城市报价为空或异常
    if target_sisuo_data["price"] == -1:
      print(f"({data_key})在索思学会数据中价格异常")
      continue
    # 如果思索学会数据中的价格和当前市场最新上报数据中的价格一致，则跳过
    if target_product_latestdata and target_product_latestdata["price"] == target_sisuo_data["price"]:
      latest_log_timestamp = (datetime.strptime(target_product_latestdata['uploadedAt'], '%Y-%m-%dT%H:%M:%S.%fZ').timestamp())
      # 如果当前市场最新上报数据更新时间和思索学会数据更新时间相隔在60分钟内，则跳过
      if latest_log_timestamp - target_sisuo_data["update_timestamp"] < 60 * 60:
        # print(
        #   f"({data_key})在当前市场最新上报数据中价格未发生变化，不上报。" + 
        #   f"当前市场最新数据更新时间: {time.strftime('%Y-%m-%d %H:%M:%S', time.strptime(target_product_latestdata['uploadedAt'], '%Y-%m-%dT%H:%M:%S.%fZ'))}"
        # )
        no_change_data_count += 1
        continue
    # 添加商品数据
    to_upload_transaction_data.append({
      "name": item["name"], # 商品名称
      "price": target_sisuo_data["price"], # 商品实时价格
      "percent": round((target_sisuo_data["price"] * 100) / item["base_price"]), # 商品价格相对基础价格的百分比
      "sourceCity": item["sourceCity"], # 商品买入城市
      "targetCity": item["targetCity"], # 商品售卖城市
      "trend": "up" if target_sisuo_data["next_trend"] > 0 else "down" if target_sisuo_data["next_trend"] < 0 else "flat", # 商品价格趋势
      "type": item["type"], # 商品交易类型
      "uploadedAt": target_sisuo_data["update_timestamp"] * 1000, # 思索学会的数据更新时间作为上报时间
    })

  print("本次上报数据中价格未发生变化的商品数量：", no_change_data_count, "条")
  return to_upload_transaction_data

while True:
  try:
    print("开始上报数据，现在是北京时间：", time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
    print("开始获取商品基准数据……")
    # 远程请求获取github仓库中最新的商品数据
    product_metadata_response = requests.get(f"{base_url}/api/info/products", headers={ "User-Agent": "resonance-market" })
    product_metadata = product_metadata_response.json()
    print("获取商品基准数据成功")
    
    print("开始获取商品最新上报数据……")
    # 远程请求获取github仓库中最新的商品数据
    product_latestdata_response = requests.get(f"{base_url}/api/product", headers={ "User-Agent": "resonance-market" })
    product_latestdata = product_latestdata_response.json()["latest"]
    print("获取商品最新上报数据成功")

    # 从商品基准数据筛选并转换为需要上报的交易元数据
    transaction_meatadata = product_metadata_to_transaction_meatadata(product_metadata)

    # 请求索思学会市场实时数据
    print("开始获取索思学会数据……")
    sisuo_data_response = requests.get(f"https://resonance.breadio.wiki/api/resodata/api/fetch/goods_info?uuid={uuid}", headers={ "User-Agent": "resonance-market" })
    sisuo_data = sisuo_data_response.json()
    print("获取索思学会数据成功")

    # 筛选要上传的数据
    filtered_data = filter_products_to_upload(sisuo_data, transaction_meatadata, product_latestdata)

    response = requests.post(
      f"{base_url}/api/logs",
      json=filtered_data,
      # 添加请求头
      headers={
        "User-Agent": "resonance-market"
      }
    )
    # 检查POST请求是否成功
    if response.status_code == 200:
      print(f"市场数据上报成功")
    else:
      print(f"市场数据上报失败，HTTP Code: {response.status_code}", "\n元数据：", filtered_data)
    
    print(f"数据上报完成, 本次上报数据条数：{len(filtered_data)}条")
    print(f"下一次上报时间：{time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time() + 300))}")
  except Exception as e:
    print("数据上报失败，错误信息：", e)

  # 等待1分钟
  time.sleep(60)