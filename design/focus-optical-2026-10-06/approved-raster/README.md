确认稿：../1-focus.svg。三角形 translate(-0.6 0.5)。
固定 512×512 视口渲染并等待绘制完成，随后从同一母版缩小到所有目标尺寸。避免连续切换视口截图：此前导出出现重复条带。
导出使用 magick <master.png> -resize NxN PNG32:<output.png>，保持 RGBA 透明度。每次必须检查所有最终 PNG，不得只检查 128px 预览。
