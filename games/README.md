# 游戏目录

所有游戏都放在本目录下，**每个游戏对应一个独立的子文件夹**。

## 添加新游戏

1. 新建子文件夹，命名建议使用英文或拼音，例如 `tetris/`、`guoguo/`，避免空格和特殊字符；
2. 将游戏文件全部放入该文件夹，不要散落在 `games/` 根目录；
3. 在该文件夹内创建 `README.md`，推荐模板如下：

```markdown
# 游戏名称

- **类型**：益智 / 动作 / 教育 / 休闲 / 其他
- **适合年龄**：如 5 岁以上
- **玩法简介**：一两句话说明怎么玩
- **运行方式**：如「用浏览器打开 index.html」或「安装 xx.apk」
```

4. 如果有封面图或截图，可放在游戏文件夹内并命名为 `cover.png`，方便统一展示。

## 目录示例

```text
games/
├── README.md
├── little-train/    # 小火车呜呜开（3D 无限列车）
│   ├── README.md
│   └── index.html
├── memory-match/    # 动物记忆翻翻乐
├── 1024/            # 1024 数字合并
├── hex-2048/        # 六边形2048（数字联盟爱消除款型）
├── gomoku/          # 五子棋
├── link-game/       # 连连看
├── match-three/     # 消消乐
├── snake/           # 贪吃蛇
├── breakout/        # 打砖块
├── slide-puzzle/    # 数字华容道
├── find-difference/ # 火眼金睛找不同
├── arrow-out/       # 箭头消除 1000 关（关卡预生成 + 求解器校验）
│   ├── README.md
│   ├── index.html
├── dino-run/        # 恐龙快跑（横版跑酷跳跃）
├── space-shooter/   # 太空大战（竖版飞行射击）
├── car-race/        # 疯狂赛车（竖版躲避竞速）
├── gold-miner/      # 黄金矿工（钩爪抓取）
│   └── levels/      # l001.js…l010.js，每块 100 关按需加载
├── puzzle/          # 拼图游戏
│   ├── README.md
│   └── ...
└── ...
```
