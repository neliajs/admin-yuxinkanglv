<script>
import listPageMixin from '@/mixins/list-page'

export default {
  name: 'ShopManage',

  mixins: [listPageMixin],

  data() {
    return {
      searchProps: {
        pathname: 'shopManageList'
      },
      tableProps: {
        columns: [
          { align: 'center', label: '店名', prop: 'name' },
          { align: 'center', label: '地址', prop: 'address' },
          { align: 'center', label: '联系电话', prop: 'cellphone' },
          { align: 'center', label: '录入时间', prop: 'time' },
          { align: 'center', label: '状态', prop: 'status' },
        ],
        data: [
          {
            name: '兰州拉面',
            address: '银虎路30号',
            cellphone: '13010101010',
            time: '2022.10.10 13:00:00',
            status: '正常'
          },
          {
            name: '柳州螺蛳粉',
            address: '银虎路31号',
            cellphone: '13010101010',
            time: '2022.10.10 13:00:00',
            status: '禁用'
          },
        ],
        operatorProps: {
          align: 'center',
          // width: 'auto'
        },
        operator: [
          ({ row }) => ({
            text: row.status === 'success' ? '禁用' : '启用',
            on: { click: () => { console.log(123) } }
          }),
          {
            text: '修改',
            on: {
              click: () => {

              }
            }
          },
          {
            text: '删除',
            on: {
              click: () => {

              }
            }
          }
        ]
      },

      form: {
        shopName: '',
        address: '',
        phone: '',
        status: ''
      },

      dialogRow: {
        type: 'add',
        visible: false,
        form: {
          shopName: '',
          address: '',
          phone: '',
          status: '1',
        }
      },

      headerSlotComponents: [
        h => (
          <el-dialog
            title={this.dialogRow.type === 'add' ? '增加门店' : '修改门店'}
            visible={this.dialogRow.visible}
            { ...{ on: { 'update:visible': e => this.dialogRow.visible = e } } }
            width="30%"
          >
            <el-form ref="form" label-width="auto">
              <el-form-item label="店名" required>
                <el-input placeholder="门店名称" v-model={this.dialogRow.form.shopName} />
              </el-form-item>
              <el-form-item label="地址" required>
                <el-input placeholder="门店地址" v-model={this.dialogRow.form.address} />
              </el-form-item>
              <el-form-item label="联系电话" required>
                <el-input placeholder="门店联系电话" v-model={this.dialogRow.form.phone} />
              </el-form-item>
              <el-form-item label="状态" required>
                <el-radio v-model={this.dialogRow.form.status} label="1">正常</el-radio>
                <el-radio v-model={this.dialogRow.form.status} label="0">禁用</el-radio>
              </el-form-item>
            </el-form>
            <div class="text-center">
              <el-button onClick={() => this.clear()}>清空重置</el-button>
              <el-button type="primary" onClick={() => this.confirmAdd()}>确认新增</el-button>
            </div>
          </el-dialog>
        ),

        h => <el-button type="primary" onClick={() => this.handleAddShop()}>+增加</el-button>
      ]
    }
  },

  computed: {
    formList() {
      return [
        {
          type: 'input',
          label: '商户编号',
          placeholder: '商户编号',
          model: 'merchantId',
        },
        {
          type: 'input',
          label: '商户账号',
          placeholder: '商户账号',
          model: 'account',
        },
        {
          type: 'input',
          label: '商户名称',
          placeholder: '商户名称',
          model: 'merchantName',
        },
        {
          type: 'select',
          label: '状态',
          placeholder: '请选择',
          model: 'merchantName',
          options: [
            { label: '全部', value: '' },
            { label: '正常', value: 'success' },
            { label: '禁用', value: 'forbin' },
          ]
        },
      ]
    }
  },

  methods: {
    handleAddShop() {
      this.dialogRow.type = 'add'
      this.dialogRow.visible = true
    },

    clear() {
      this.dialogRow.form = {
        shopName: '',
        address: '',
        phone: '',
        status: '1',
      }
    },

    async confirmAdd() {
      console.log(this.dialogRow.form)
      const { data } = await this.$api.shopAdd()
      console.log(data)
    },
  }
}
</script>
