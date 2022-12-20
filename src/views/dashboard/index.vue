<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col class="elcol" :span="6" v-for="item in 8" :key="item">
        <el-card class="box-card">
          <div class="text item">
            <div class="title">{{item}}</div>
            {{'列表内容 ' + item }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',

  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  created() {
    this.fetchDatas()
  },
  methods: {
    fetchDatas() {
      console.log('fetch')
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.elcol {
  margin-bottom: 20px;
  text-align: center;
}
.title {
  font-size: 34px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
