import {
  Plugin,
  getFrontend,
} from "siyuan";
import "@/index.scss";
import PluginInfoString from '@/../plugin.json'
import { destroy, init } from '@/main'

let PluginInfo = {
  version: '',
}
try {
  PluginInfo = PluginInfoString
} catch (err) {
  console.log('Plugin info parse error: ', err)
}
const {
  version,
} = PluginInfo

export default class PluginSample extends Plugin {
  // Run as mobile
  public isMobile: boolean
  // Run in browser
  public isBrowser: boolean
  // Run as local
  public isLocal: boolean
  // Run in Electron
  public isElectron: boolean
  // Run in window
  public isInWindow: boolean
  public platform: SyFrontendTypes
  public readonly version = version

  async onload() {
    const frontEnd = getFrontend();
    this.platform = frontEnd as SyFrontendTypes
    this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile"
    this.isBrowser = frontEnd.includes('browser')
    this.isLocal =
      location.href.includes('127.0.0.1')
      || location.href.includes('localhost')
    this.isInWindow = location.href.includes('window.html')

    try {
      require("@electron/remote")
        .require("@electron/remote/main")
      this.isElectron = true
    } catch (err) {
      this.isElectron = false
    }

    console.log('Plugin loaded, the plugin is ', this)

    await init(this)

    // 添加右键菜单
    this.addEditorContextMenu()
  }

  addEditorContextMenu() {
    // 添加编辑器右键菜单
    this.eventBus.on('click-editorcontent', ({ detail }: any) => {
      const selection = window.getSelection()
      const selectedText = selection?.toString().trim()

      if (selectedText) {
        // 获取选中内容所在的块ID
        const range = selection?.getRangeAt(0)
        const container = range?.commonAncestorContainer
        let blockElement = container?.parentElement

        // 向上查找包含 data-node-id 的元素
        while (blockElement && !blockElement.getAttribute('data-node-id')) {
          blockElement = blockElement.parentElement
        }

        const blockId = blockElement?.getAttribute('data-node-id')

        if (blockId) {
          detail.menu.addItem({
            icon: 'iconAdd',
            label: this.i18n.addToTodo,
            click: () => {
              if (window._sy_plugin_sample?.addTaskFromSelection) {
                window._sy_plugin_sample.addTaskFromSelection(selectedText, blockId)
              }
            }
          })
        }
      }
    })
  }

  onunload() {
    destroy()
  }

  openSetting() {
    // 显示开发中提示
    if (window.siyuan && (window.siyuan as any).showMessage) {
      (window.siyuan as any).showMessage('设置功能开发中 / Settings under development', 3000, 'info')
    } else {
      alert('设置功能开发中 / Settings under development')
    }
  }
}
