#!/bin/bash
# Proud Tek 本地网站启动脚本
# 双击此文件即可在浏览器中打开网站

cd "$(dirname "$0")"

echo "🚀 正在启动 Proud Tek 本地网站..."
echo "📂 网站目录: $(pwd)/dist-restored"
echo ""

# 检查 dist-restored 是否存在
if [ ! -d "dist-restored" ]; then
    echo "❌ 错误: 找不到 dist-restored 目录"
    echo "请确保此脚本在 Playground 项目根目录中"
    read -p "按回车键退出..."
    exit 1
fi

# 先尝试用 npx serve（更好的静态文件支持）
if command -v npx &>/dev/null; then
    echo "✅ 使用 npx serve 启动..."
    echo "🌐 网站地址: http://localhost:4321"
    echo "🛑 按 Ctrl+C 停止服务器"
    echo ""
    open "http://localhost:4321"
    npx serve dist-restored -p 4321 -s
else
    # 回退到 Python
    echo "✅ 使用 Python 启动..."
    echo "🌐 网站地址: http://localhost:4321"
    echo "🛑 按 Ctrl+C 停止服务器"
    echo ""
    open "http://localhost:4321"
    python3 -m http.server 4321 --directory dist-restored
fi
