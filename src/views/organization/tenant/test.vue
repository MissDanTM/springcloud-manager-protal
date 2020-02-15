<template>
  <div class="app-container">
    <el-table :data="list"
              height="500"
              element-loading-background="rgba(0, 0, 0, .3)"
              style="width: 100%">
       <el-table-column type="expand" prop="names">
         <template slot-scope="scope" >
           <el-table  :data="scope.row.names" >
              <el-table-column prop="name" label="名称" sortable align="center">
                 <template slot-scope="scope">
                   <span>{{scope.row.name}}</span>
                 </template>
              </el-table-column>
              <el-table-column prop="num" label="数量" sortable align="center">
                 <template slot-scope="scope">
                   <span>{{scope.row.num}}</span>
                 </template>
              </el-table-column>

           </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="Id" label="编号" sortable align="center" >
        <template slot-scope="scope">
          <span>{{scope.row.Id}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" width="100" label="操作">
        <template slot-scope="scope">
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button class="btn-drop-down" @click="selectRow(scope.row)">
              <i class="el-icon-arrow-down"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit">编辑</el-dropdown-item>
              <el-dropdown-item command="del">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { queryTenant, getTenant, createTenant, updateTenant, deleteTenant } from '@/api/organization/tenant'

  import waves from '@/directive/waves'

  export default {
    name: 'tenantManagement',
    // 水波文效果
    directives: {
      waves
    },
    data() {
      return {
        list: [
           {
           Id: '1店',
            names: [{
               name:'apple',
               num:1
             },{
               name:'banana',
               num:2
             }]
           },
            {
            Id: '2店',
             names: [{
               name: 'apple',
               num:1
             },{
               name: 'banana',
               num:2
             }]
           }
        ]
      }
    }
  }
</script>
