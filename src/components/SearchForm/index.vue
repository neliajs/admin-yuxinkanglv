<template>
  <el-form class="searchFrom" label-position="left" :model="form" size="small" v-show="formList.length">
    <div class="search-list">
      <div class="li" v-for="(item,index) in formList" :key="index">
        <!-- <el-row :gutter="10"> -->
        <!-- <el-col :span="item.col||col" v-for="(item,index) in formList" :key="index"> -->
        <!-- 输入框 -->
        <template v-if="item.type=='input'">
          <el-form-item :label="item.label">
            <el-input
              class="text"
              :placeholder="item.placeholder ? item.placeholder : '请输入' + (item.label||'')"
              v-model="form[item.model]"
              :maxlength="item.maxlength || ''"
              @input="(val)=>{changeInput(val,item)}"
            ></el-input>
          </el-form-item>
        </template>
        <!-- 选择下拉列表 -->
        <template v-if="item.type=='select'">
          <el-form-item :label="item.label">
            <el-select
              class="width-100"
              v-model="form[item.model]"
              :placeholder="item.placeholder ? item.placeholder : '请输入' + (item.label||'')"
            >
              <el-option
                v-for="val in item.options"
                :key="val[item.value]"
                :label="val[item.label || item.value] || val.label"
                :value="val[item.value] || val.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <!-- 月份 -->
        <template v-if="item.type=='month'">
          <el-form-item :label="item.label">
            <el-date-picker
              v-model="form[item.model]"
              type="month"
              format="yyyy-MM"
              value-format="yyyy-MM"
              style="width: 100%"
              :placeholder="item.placeholder ? item.placeholder : '选择月'"
            ></el-date-picker>
          </el-form-item>
        </template>
        <!-- 日期 pickerOptions(日期快捷键) -->
        <template v-if="item.type=='date'">
          <el-form-item :label="item.label">
            <el-date-picker
              v-model="form[item.model]"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              :placeholder="item.placeholder ? item.placeholder : '选择日期'"
              :picker-options="item.pickerOptions?pickerOptions:[]"
            ></el-date-picker>
          </el-form-item>
        </template>
        <!-- 时间范围 start(开始时间) end(结束时间) -->
        <template v-if="item.type=='dateTimeRange'">
          <el-form-item :label="item.label">
            <el-date-picker
              v-model="form[item.model]"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptionsRange"
              @change="(val)=>{changeDateRange(val,item)}"
            ></el-date-picker>
          </el-form-item>
        </template>
        <!-- 日期范围 start(开始日期) end(结束日期) -->
        <template v-if="item.type=='dateRange'">
          <el-form-item :label="item.label">
            <el-date-picker
              v-model="form[item.model]"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptionsRange"
              @change="(val)=>{changeDateRange(val,item)}"
            ></el-date-picker>
          </el-form-item>
        </template>
        <!-- 月份范围 start(开始时间) end(结束时间)-->
        <template v-if="item.type=='monthRange'">
          <el-form-item :label="item.label">
            <el-date-picker
              v-model="form[item.model]"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              style="width: 100%"
              value-format="yyyy-MM"
              :picker-options="pickerOptionsMonthRange"
              @change="(val)=>{changeDateRange(val,item)}"
            ></el-date-picker>
          </el-form-item>
        </template>
        <!-- 数字范围 start最小值 end最大值 -->
        <template v-if="item.type=='inputRange'">
          <el-form-item :label="item.label">
            <div class="inputRange">
              <el-input
                :placeholder="item.startPlaceholder ? item.startPlaceholder : '请输入' + (item.label||'') + '最小值'"
                v-model="form[item.start]"
                :maxlength="item.maxlength || ''"
                v-price
              ></el-input>
              <span class="inputRange-text">至</span>
              <el-input
                :placeholder="item.endPlaceholder ? item.endPlaceholder : '请输入' + (item.label||'') + '最大值'"
                v-model="form[item.end]"
                :maxlength="item.maxlength || ''"
                v-price
              ></el-input>
            </div>
          </el-form-item>
        </template>
        <template v-if="item.type=='radioGroup'">
          <el-form-item :label="item.label">
            <el-radio-group v-model="form[item.model]">
              <!--
              <el-option :value="val[item.value]">
              </el-option>-->

              <el-radio-button
                :label="val[item.value]"
                v-for="val in item.options"
                :key="val[item.value]"
              >{{val[item.text]}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </template>
        <!-- </el-col> -->
        <!-- </el-row> -->
      </div>

      <slot></slot>
    </div>
    <div class="search-btns">
      <el-button type="primary" @click="search">查询</el-button>
      <el-button @click="reset">重置</el-button>
      <slot name="buttons"></slot>
    </div>
  </el-form>
</template>

<script>
export default {
  name: "SearchForm",
  props: {
    value: {
      //form表单
      type: Object,
      required: true,
    },
    formList: {
      type: Array,
      default() {
        return [];
      },
    },
    resetForm: {
      //充值表单
      type: Object,
    },
  },
  computed: {
    form() {
      return this.value;
    },
  },
  data() {
    return {
      initForm: {}, // 存放重置表单数据
      col: 6, //每个表单项要占的多少栅格
      pickerOptions: {
        // 时间组件快捷选项
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      pickerOptionsRange: {
        // 时间范围组件快捷选项
        shortcuts: [
          {
            text: "昨天",
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 0);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近七天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      pickerOptionsMonthRange: {
        //月份范围快捷选项
        shortcuts: [
          {
            text: "本月",
            onClick(picker) {
              picker.$emit("pick", [new Date(), new Date()]);
            },
          },
          {
            text: "今年至今",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近六个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  mounted() {
    // 保存表单初始状态到initForm,方便重置
    this.initForm = JSON.parse(JSON.stringify((this.resetForm ? this.resetForm : this.form)));
  },
  methods: {
    search() {
      //搜索
      this.$emit("search", this.form);
    },
    reset() {
      //重置
      let that=this;
      let keyArr = [];
      this.formList.map((item) => {
        item.model ? keyArr.push(item.model) : "";
        item.start ? keyArr.push(item.start) : "";
        item.end ? keyArr.push(item.end) : "";
      });
      if (typeof this.initForm !== "undefined") {
        // 如果有传递resetForm,则使用resetForm数据重置
          Object.keys(this.form).forEach((k) => {
              if (keyArr.includes(k)) {
            that.form[k] = JSON.parse(JSON.stringify(that.initForm[k]));
          }
        });
      } else {
        // 否则全部置空
        Object.keys(this.form).forEach((k) => {
          this.form[k] = "";
        });
      }
      this.$emit("reset");
    },
    changeDateRange(val, item) {
      //时间范围改变
      const startTime = val ? val[0] : "";
      const endTime = val ? val[1] : "";
      this.util.setValByKey(this.form, item.start, startTime);
      this.util.setValByKey(this.form, item.end, endTime);
    },
    changeInput(val, item) {
      //input类型输入限制
      if (item.directive === "enterNumber") {
        //只能输入数字
        val = val.replace(/[^\d]/g, "");
        this.util.setValByKey(this.form, item.model, val);
      }
    },
  },
};
</script>

<style lang="scss">
$label-width: 94px;

.searchFrom {
  padding: 20px 0;
  background: white;
  overflow: hidden;
  .search-list {
    display: flex;
    flex-wrap: wrap;
    .li {
      margin-right: 20px;
      width: 354px;
    }
  }
  .el-cascader .el-input {
    width: 260px;
  }
  .el-form-item {
    display: flex;
    .el-form-item__label {
      text-align: right;
      width: $label-width;
      padding-right: 10px;
    }
    .el-form-item__content {
      flex: 1;
      .width-100 {
        width: 100% !important;
      }
      .el-range-separator {
        width: auto;
      }
      .inputRange {
        display: flex;
        .inputRange-text {
          padding: 0 5px;
        }
      }
    }
  }
  .search-btns {
    display: flex;
    padding-left: $label-width;
    .el-button {
      padding: 0 10px;
      // line-height: 30px;
      height: 30px;
      text-align: center;
      min-width: 70px;
      margin: 0 10px 0 0;
    }
  }
}
</style>
