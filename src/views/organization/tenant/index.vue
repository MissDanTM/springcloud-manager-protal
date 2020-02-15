<template>
  <div class="app-container">
    <div class="filter-container">

      <!--查询条件-->
      <el-input @keyup.enter.native="handleFilter"
                style="width: 200px;"
                class="filter-item"
                placeholder="租户名"
                v-model="listQuery.tenantName">
      </el-input>
      <el-input @keyup.enter.native="handleFilter"
                style="width: 200px;"
                class="filter-item"
                placeholder="创建人"
                v-model="listQuery.createdBy">
      </el-input>
      <el-select clearable
                 style="width: 120px"
                 class="filter-item"
                 v-model="listQuery.enabled"
                 placeholder="是否可用">
        <el-option v-for="item in enabled"
                   :key="item.code"
                   :label="item.name"
                   :value="item.value">
        </el-option>
      </el-select>

      <!--动作按钮-->
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

    <!--列表-->
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column type="expand"  @click="getUserMsg(scope.row.id)" prop="userMsg">
         <template slot-scope="scope" >
           <el-table  :data="scope.row.userMsg" >
              <el-table-column prop="name" label="用户名" sortable align="center">
                 <template slot-scope="scope">
                   <span>{{scope.row.name}}</span>
                 </template>
              </el-table-column>
              <el-table-column prop="introd" label="简介" sortable align="center">
                 <template slot-scope="scope">
                   <span>{{scope.row.introd}}</span>
                 </template>
              </el-table-column>

           </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50" align="center" label="ID"/>

      <el-table-column width="150px" align="center" label="租户名">
        <template slot-scope="scope">
          <span>{{scope.row.tenantName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="是否可用">
        <template slot-scope="scope">
          <span> {{scope.row.enabled==true?'可用':'不可用'}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.createdBy}}</span>
        </template>
      </el-table-column>

      <!--<el-table-column class-name="status-col" label="$t('table.status')" width="80">-->
      <!--<template slot-scope="scope">-->
      <!--<el-tag :type="scope.row.status | statusFilter">{{$t('user.status.'+scope.row.status)}}</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">
            修改
          </el-button>
          <el-button type="danger" size="mini" @click="deleteData(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页工具条-->
    <div class="pagination-container">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.current"
                     :page-sizes="[10, 20, 30, 50]"
                     :page-size="listQuery.size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--添加或编辑对话框-->
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right"
               label-width="120px" status-icon
               style='width: 80%; margin-left:60px;'>
        <el-form-item label="租户姓名" prop="tenantName">
          <el-input v-model="temp.tenantName" placeholder="请输入租户姓名"></el-input>
        </el-form-item>
        <el-form-item label="是否可用" prop="enabled">
          <el-select v-model="temp.enabled"  clearable
                     style="width: 100%;" placeholder="请选择">
            <el-option v-for="item in enabled"
                       :key="item.code"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input :rows="5"
                    type="textarea"
                    v-model="temp.description"
                    placeholder="请输入描述">
          </el-input>
        </el-form-item>
      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-if="dialogStatus=='edit'" type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { queryTenant, getUserMsg, getTenant, createTenant, updateTenant, deleteTenant } from '@/api/organization/tenant'

  import waves from '@/directive/waves'

  export default {
    name: 'tenantManagement',
    // 水波文效果
    directives: {
      waves
    },
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        downloadLoading: false,
        // 查询参数
        listQuery: {
          current: 1,
          size: 10
        },
        // 用户状态
        enabled: [{code:true,name:'可用',value:true},{code:false,name:'不可用',value:false}],
        dialogStatus: 'create',
        dialogFormVisible: false,
        // 表单校验规则
        rules: {
          tenantName: [
            { required: true, message: '租户名必填', trigger: 'blur' },
            { min: 2, max: 100, message: '租户名长度在2到100个字符', trigger: 'blur' }
          ],
          description: [{ min: 0, max: 500, message: '描述在500字符以内', trigger: 'blur' }],
        },
        // 创建或修改用户临时对象
        temp: {}
      }
    },
    filters: {
      // 用户状态标签样式
      statusFilter(status) {
        const statusMap = {
          lock: 'danger',
          deleted: 'info',
          ok: 'success'
        }
        return statusMap[status]
      }
    },
    // 页面加载完成后显示列表页
    created() {
      this.queryTenant()
      this.resetForm()
    },
    methods: {
      /**
       * 租户列表
       */
      queryTenant() {
        this.listLoading = true
        queryTenant(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      // 查询过滤器
      handleFilter() {
        this.listQuery.current = 1
        this.queryTenant()
      },
      /**
       * 修改每页显示条数
       */
      handleSizeChange(val) {
        this.listQuery.size = val
        this.queryTenant()
      },
      /**
       * 跳转到指定页
       */
      handleCurrentChange(val) {
        this.listQuery.current = val
        this.queryTenant()
      },
      /**
       * 重置添加表单
       */
      resetForm() {
        this.temp = {
          tenantName: '',
          description:'',
          enabled:''
        }
      },
      /**
       * 转换enabled
       */
      resetEnabled(enabled) {
        switch(enabled){
          case true:
          enabled='可用';
          break;
          case false:
          enabled='不可用';
          break;
          case '可用':
          enabled=true;
          break;
          case '不可用':
          enabled=false;
          break;
        }
        return enabled;
      },
      /**
       * 弹出创建租户表单
       */
      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.resetForm()
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      /**
       * 创建租户
       */
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createTenant(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '创建成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.queryTenant()
            })
          }
        })
      },
      /**
       * 弹出修改租户表单
       */
      handleUpdate(id) {
        this.listLoading = true
        getTenant(id).then(response => {
          response.data.enabled = this.resetEnabled(response.data.enabled)
          this.temp = response.data
          this.listLoading = false
          this.dialogStatus = 'edit'
          this.dialogFormVisible = true
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      /**
       * 查询关联用户数据
       */
      getUserMsg(id) {
        /* getUserMsg(id).then(response => {

        }) */
        this.list.
      },
      /**
       * 修改租户信息
       */
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateTenant(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '编辑成功',
                message: '编辑成功',
                type: 'success',
                duration: 2000
              })
              this.queryTenant()
            })
          }
        })
      },
      /**
       * 删除用户
       */
      deleteData(id) {
        this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          type: 'warning'
        }).then(() => {
          deleteTenant(id).then(() => {
            this.$notify({
              title: '删除成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.queryTenant()
          })
        })
      },
      /**
       * 导出列表
       */
      handleDownload() {
        console.log('download')
      }
    }
  }
</script>
