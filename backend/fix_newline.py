# 保存这个脚本为 fix_newline.py，然后运行它
with open('app/main.py', 'r', encoding='utf-8') as file:
    content = file.read().rstrip()  # 移除所有尾部空白

# 确保有一个干净的结尾换行符
with open('app/main.py', 'w', newline='\n', encoding='utf-8') as file:
    file.write(content + '\n')

print("已修复 app/main.py 的换行符问题") 