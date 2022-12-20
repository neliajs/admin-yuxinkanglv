function parsePath (path) {
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}

export default {
  props: {
    selectionType: {
      type: String,
      default: '',
      validator: val => ['checkbox', 'radio', ''].includes(val)
    }
  },

  data() {
    return {
      PAGE_SIZE: 15,

      /**
       * 查询相关配置
       * 例:
         searchProps: {
           pathname: 'welfare.welfareList',
           extraParams: { isMerchant: '0' }
         }
       */
      searchProps: {
        pathname: '', // 列表查询接口的 "文件-方法" 路径, 例: welfare.welfareList 就表示在 src/api/modules/welfare.js 文件中的 welfareList 方法
        extraParams: {}, // 查询接口的额外参数, 一些要写死传给后台的参数
      },

      /**
       * 导出相关配置, 填写此配置会自动将配置的按钮加入到 搜索/重置 按钮右边
       * 例:
         exportProps: {
           url: 'welfareDeal/report',
           fileName: '订单报表',
         }
       */
      exportProps: {
        url: '', // 导出路径(填写会自动加上导出按钮, 不填则不会, 前面不用加, 导出路径前缀)
        fileName: '', // 导出文件的名字, 必填
        text: '', // 导出按钮的文字, 例: "导出报表", 不填默认为: "导出"
        type: '', // 导出按钮的类型, 例: "text", 为文字类型, 不填默认为 "primary", 蓝色的按钮
        extraParams: {}, // 导出要传给后台的一些写死的数据
      },

      // 双向绑定给 pg-search 组件的数据
      form: {},

      // n-panel 配置信息
      panelProps: {},

      /**
       * el-tabs 配置信息
       * 例:
        tabProps: {
          currentTab: '',
          tabs: [
            { label: '全部', name: '' },
            { label: '待设置', name: '3' },
            { label: '待提交', name: '2' },
            { label: '审核中', name: '0' },
          ],
          paramKey: 'status'
        },
       */
      tabProps: {
        currentTab: '', // 当前绑定的 tab 的 name, 初始化的时候要给出
        tabs: [],
        paramKey: '' // 搜索请求要出入的参数key
      },

      // 绑定给 table 的参数
      tableProps: {},

      // table表格加载状态
      tableLoading: false,

      // 确认弹出框的默认参数
      confirmDialogParams: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },

      /**
       * 头部需要动态传入渲染的组件
       * 可传入一些如:
       *     html标签 <div>一些提示</div>
       *     新增按钮 <el-button on-click={this.handleClickAdd}>新增XXX</el-button>
       *     自定义组件 <sku-setting-dialog xxx属性 />
       * 
       * 例:
        headerSlotComponents: [
          h => {
            const name = '新增XXX'
            return <div>{name}</div>
          },

          h => <el-button on-click={this.handleClickAdd}>新增XXX</el-button>,

          h => (
            <sku-setting-dialog
              visible={this.skuDialog.show}
              dialog={this.skuDialog}
              {
                ...{
                  on: {
                    'update:visible': e => this.skuDialog.show = e,
                    save: this.onSave,
                    submit: this.onSubmit
                  }
                }
              }
            />
          ),
        ],
      */
      headerSlotComponents: [],

      /**
       * 底部需要动态传入渲染的组件, 例如一些弹出框等, 组件如果有自己重写
       * 例: 同上个 headerSlotComponents
       */
      bodySlotComponents: [],

      /**
       * 底部需要动态传入渲染的组件, 例如一些弹出框等, 组件如果有自己重写
       * 例: 同上个 headerSlotComponents
       */
      footerSlotComponents: [],
    }
  },

  computed: {
    // 传递给 pg-search 的搜索条件数据
    formList() {
      return []
    },

    // 搜索栏目 的要加入的按钮插槽
    searchFormSlotButtons() {
      return []
    },

    // 如果 table 的 columns 是动态变化的, 不方便写在 tableProps 里面的时候, 就重写此方法
    tableColumns() {},

    // 如果 table 的 operator 是动态变化的, 不方便写在 tableProps 里面的时候, 就重写此方法
    tableOperator() {}
  },

  methods: {
    initTableProps() {
      if (!this.tableProps) {
        return
      }

      // 将分页组件设置为显示
      this.tableProps.showPagination = true
      this.tableProps.headerSticky = true

      // 设置分页组件的默认属性
      if (!this.tableProps.paginationInfo) {
        this.tableProps.paginationInfo = {
          index: 1,
          size: this.PAGE_SIZE,
        }
      }

      // 设置分页组件的默认属性
      if (!this.tableProps.paginationProps) {
        this.tableProps.paginationProps = {
          layout: 'total, prev, pager, next, sizes, jumper',
          background: true,
          pageSizes: [15, 30, 50]
        }
      }

      // 设置操作列的默认属性
      if (!this.tableProps.operatorProps) {
        this.tableProps.operatorProps = {
          align: 'center'
        }
      }

      // 设置table列的选择列(如果有的话)
      if (this.selectionType) {
        const firstColumn = this.tableProps.columns[0] || this.tableColumns[0]

        const column2add = this.selectionType === 'radio' ? {
          align: 'center',
          width: 40,
          prop: 'select',
          render: (h, { row }) => (
            <el-radio class="empty-label" label={true} value={row.checked} on-change={val => {
              this.tableProps.data.forEach(i => i.checked = false)
              row.checked = true
            }}>&nbsp;</el-radio>
          )
        } : { align: 'center', type: 'selection' }

        if (firstColumn.type === 'selection') {
          this.tableProps.columns.splice(0, 1, column2add)
        } else {
          this.tableProps.columns.unshift(column2add)
        }
      }
    },

    /**
     * 处理查询提交前的参数
     * @param {Object} params 请求回来的数据
     * @returns 处理好的要提交查询的数据
     */
    formatParamsBeforeSearch(params) {
      return params
    },

    /**
     * 处理列表查询返回的数据
     * @param {Array} data 请求回来的数据
     * @returns 处理好的要绑定给 tableProps.data 的数据
     */
    formatDataAfterSearch(data) {
      return data
    },

    /**
     * 列表搜索方法
     * @param {Object} info 分页参数信息 (table组件已经封装好了, 不需要手动处理了)
     */
    async search(info) {
      if (!info || !info.index) {
        this.tableProps.paginationInfo.index = 0
        info = {
          index: 0,
          size: this.PAGE_SIZE
        }
      } else {
        info.index = info.index - 1
      }

      if (!this.searchProps.pathname) {
        throw new Error('请在列表页组件内传入 pathname 参数, 具体请查看 src/mixins/list-page.js 文件')
      }
      if (this.tabProps.tabs && this.tabProps.tabs.length && !this.tabProps.paramKey) {
        throw new Error('请传入 tabProps 对象的 paramKey 参数, 此参数将作为搜索时, 要传入的搜索条件的 key, 绑定的是当前选中 tab 的 name')
      }

      const getter = parsePath(this.searchProps.pathname)
      const request = getter.call(this.$api, this.$api)
      if (!request) {
        throw new Error('未找到 pathname 参数对应的请求方法, 请检查是否正确')
      }
      // 组装请求参数
      const params = {
        ...this.form,
        ...this.searchProps.extraParams,
        ...info
      }

      // 列表请求方法
      try {
        this.tableLoading = true
        this.tableProps.data = []
        const { data } = await request(this.formatParamsBeforeSearch(params))
        let tableData = data.items || data
        if (this.selectionType) {
          tableData = tableData.map(i => ({ ...i, checked: false }))
        }
        this.tableProps.data = this.formatDataAfterSearch(tableData)
        this.tableProps.total = data.total
      } catch (e) {
        console.error(e)
      } finally {
        this.tableLoading = false
      }
    },

    btnSearch() {
      this.$emit('search')
      this.search()
    },

    // 重置按钮方法, 如果需要自定义重置, 则重写
    reset() {}
  },

  created() {
    this.initTableProps()
    this.search()
  },

  render(h) {
    const tableDOM = (
      <n-table
        ref="table"
        v-loading={this.tableLoading}
        columns={this.tableColumns}
        operator={this.tableOperator}
        { ...{ props: this.tableProps } }
        on-page-change={this.search}
      />
    )

    return (
      <n-panel class="pd-10" title={this.panelProps.title} toolbar={this.panelProps.toolbar}>
        {this.headerSlotComponents.map(comp => comp(h))}

        <search-form
          ref="searchForm"
          // 双向绑定
          value={this.form}
          on-input={val => this.form = val}
          
          // 一些其他的属性
          form-list={this.formList}
          on-search={this.btnSearch}
          on-reset={this.reset}
        >
        </search-form>

        {this.bodySlotComponents.map(comp => comp(h))}
        
        {this.tabProps.tabs.length === 0
          ? tableDOM
          : <el-tabs
              value={this.tabProps.currentTab || 'all'}
              on-input={val => this.tabProps.currentTab = val}
              on-tab-click={() => this.search()}
              type="border-card"
            >
              {this.tabProps.tabs.map(tab => {
                if (!tab.name) tab.name = 'all'

                return (
                  <el-tab-pane label={tab.label} name={String(tab.name)}>
                    {tableDOM}
                  </el-tab-pane>
                )
              })}
            </el-tabs>
        }

        {this.footerSlotComponents.map(comp => comp(h))}
      </n-panel>
    )
  },
}