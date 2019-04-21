const getDefaultActiveKey = (elements) => {
    const target = elements.filter((element) => !element.data.disabled)[0]
    if (target) {
        return target.data.key
    }
    return null
}

const activeKeyIsValid = (elements, key) => {
    return elements.map((element) => element.data.key).includes(key)
}

const getActiveKey = (elements, activeKey) => {
    const defaultActiveKey = getDefaultActiveKey(elements)
    return !activeKey ? defaultActiveKey : !activeKeyIsValid(elements, activeKey) ? defaultActiveKey : activeKey
}
const app = getApp()
Component({
    externalClasses: ['wux-class','fixed-top'],
    relations: {
        '../tab/index': {
            type: 'child',
            linked() {
                this.changeCurrent()
            },
            linkChanged() {
                this.changeCurrent()
            },
            unlinked() {
                this.changeCurrent()
            },
        },
    },
    properties: {
        defaultCurrent: {
            type: String,
            value: '',
        },
        current: {
            type: String,
            value: '',
            observer: 'changeCurrent',
        },
        scroll: {
            type: Boolean,
            value: false,
        },
        auto: {
            type: Boolean,
            value: true,
        },
        theme: {
            type: String,
            value: 'balanced',
        },
    },
    data: {
        activeKey: '',
        keys: [],
    },
    methods: {
        updated(value, condition) {
            const elements = this.getRelationNodes('../tab/index')
            const activeKey = getActiveKey(elements, value)

            if (elements.length > 0) {
                if (condition) {
                    this.setData({
                        activeKey,
                    })

                    elements.forEach((element) => {
                        element.changeCurrent(element.data.key === activeKey, this.data.scroll, this.data.theme)
                    })
                }
            }

            if (this.data.keys.length !== elements.length) {
                this.setData({
                    keys: elements.map((element) => element.data)
                })
            }
        },
        changeCurrent(value = this.data.current) {
            this.updated(value, !this.data.auto)
        },
        emitEvent(key) {
            this.triggerEvent('change', {
                key,
                keys: this.data.keys,
            })
        },
        setActiveKey(activeKey) {
            if (this.data.activeKey !== activeKey) {
                this.updated(activeKey, this.data.auto)
            }

            this.emitEvent(activeKey)
        },
    },
    ready() {
        const { defaultCurrent, current, auto } = this.data
        const activeKey = !auto ? current : defaultCurrent

        this.updated(activeKey, true)
        const children = this.getRelationNodes('../tab/index')
        const width = app.globalData.systemInfo.windowWidth/this.data.keys.length;
        children.forEach((child) => {
            child.setTabWidth(width);
        })

    },
})