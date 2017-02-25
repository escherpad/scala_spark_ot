<div id="table-of-contents">
<h2>Table of Contents</h2>
<div id="text-table-of-contents">
<ul>
<li><a href="#orgheadline4">1. Introduction</a></li>
<li><a href="#orgheadline1">2. What is spark? Why spark?</a>
<ul>
<li><a href="#orgheadline8">2.1. How can caching improve the map reduce?</a>
<ul>
<li><a href="#orgheadline5">2.1.1. What is Map Reduce looks like?</a></li>
<li><a href="#orgheadline6">2.1.2. How Map Reduce works?</a></li>
<li><a href="#orgheadline7">2.1.3. Improve the performance</a></li>
</ul>
</li>
<li><a href="#orgheadline11">2.2. Where does cache happens?</a>
<ul>
<li><a href="#orgheadline9">2.2.1. Input Data</a></li>
<li><a href="#orgheadline10">2.2.2. Intermediate</a></li>
</ul>
</li>
<li><a href="#orgheadline14">2.3. Algorithm</a>
<ul>
<li><a href="#orgheadline12">2.3.1. SQL</a></li>
<li><a href="#orgheadline13">2.3.2. Machine Learning (Spark)</a></li>
</ul>
</li>
</ul>
</li>
<li><a href="#orgheadline2">3. Tutorial</a></li>
<li><a href="#orgheadline3">4. Project description</a></li>
</ul>
</div>
</div>

# Introduction<a id="orgheadline4"></a>

In order to start our spark and scala back end project. Some basic understand of spark is necessary. Hence, The first park of this repo will be my understanding about the spark system. And the second part of this repo will be an tutorial I made for the scala and spark. Then, From the third part on will be the true beginning of our back end project.

---

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="org-right" />

<col  class="org-left" />

<col  class="org-left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-right">Section</th>
<th scope="col" class="org-left">Name</th>
<th scope="col" class="org-left">Content</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-right">1</td>
<td class="org-left">[2](#orgheadline1)</td>
<td class="org-left">Basic description of the spark system</td>
</tr>


<tr>
<td class="org-right">2</td>
<td class="org-left">[3](#orgheadline2)</td>
<td class="org-left">An runnable spark tutorial (Scala)</td>
</tr>


<tr>
<td class="org-right">3</td>
<td class="org-left">[4](#orgheadline3)</td>
<td class="org-left">Describe the project structure and API in detail</td>
</tr>
</tbody>
</table>

# What is spark? Why spark?<a id="orgheadline1"></a>

The most of the map reduce knowledge mention in this report is generated from the original google paper. (MapReduce: Simplified Data Processing on Large Clusters) 

## How can caching improve the map reduce?<a id="orgheadline8"></a>

### What is Map Reduce looks like?<a id="orgheadline5"></a>

The whole map reduce structure contains a set of workers and a master. Master is a scheduler, the user will submit tasks to the master and the master will assign the mission to the slave nodes. 

### How Map Reduce works?<a id="orgheadline6"></a>

The user submit a tasks. And the master nodes will first analysis that tasks and partition it and schedule and assign those works to the map and reducer. Map worker will read the input data (here cache may happen), than the map worker will generate the intermediate key/value pair, and this value/pair set can be cache to a disk (here cache may also happen). Many map reduce procedure will include more than 1 map reduce procedure. Thus we may need to cache the output of the map reduce procedure. 

### Improve the performance<a id="orgheadline7"></a>

Compared with the computation time cost by CPU, read data from the disk and send data via the network will cost lots of the real time. By reading the data from the local disk, and cache the intermediate data for a later usage, we can improve the total performance of the MapReduce procedure.

## Where does cache happens?<a id="orgheadline11"></a>

### Input Data<a id="orgheadline9"></a>

Master will assign the map mission to the nodes contains the data or the nodes "close" to the data.

### Intermediate<a id="orgheadline10"></a>

writing a single copy of the intermediate data to local disk.

## Algorithm<a id="orgheadline14"></a>

The algorithm for the cache in the map reduce procedure can be different for different routines. 

### SQL<a id="orgheadline12"></a>

Naive Map Reduce is quite simple, thus we hope to build a system on the top of the map reduce system that can implement the basic SQL query command. And in order to implement such query command we may need to do some optimization to cache the map reduce intermediate results and the output flow. I find some interesting paper discussing the some of the implementations like the pig (which is on top of the hadoop), Hive. However, I can't find the specific discuss about how the optimization in side it works, it is kind of frustrating.

### Machine Learning (Spark)<a id="orgheadline13"></a>

We will usually encounter a large scale of the data when dealing with the machine learning problems. And most of the time we implement a machine learning technique on top of the big data, we will perform many iterations. The naive method of the Map Reduce to deal with this problems is quite inefficiency. In fact, when we need to iterate something, it makes tons of sense to cache some of the results that we may need to use in the future iterations. Thus, the spark systems come out, it will ask user to give some hint about what needs to be cached and it will make it best effort to cache the data user indicates and generate the map reduce plan.

# Tutorial<a id="orgheadline2"></a>

# Project description<a id="orgheadline3"></a>
