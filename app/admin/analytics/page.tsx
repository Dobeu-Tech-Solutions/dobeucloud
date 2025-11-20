import { Suspense } from 'react';
import dbConnect from '@/lib/mongodb';
import Analytics from '@/lib/models/Analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRelativeTime } from '@/lib/utils';
import { Activity, AlertTriangle, TrendingUp, Users, Clock, Globe } from 'lucide-react';

async function getAnalyticsData() {
  await dbConnect();
  
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  const weekAgo = new Date(now.setDate(now.getDate() - 7));
  
  // Get various analytics metrics
  const [
    totalPageViews,
    todayPageViews,
    uniqueVisitors,
    performanceMetrics,
    recentErrors,
    topPages,
    deviceStats,
  ] = await Promise.all([
    // Total page views
    Analytics.countDocuments({ event: 'page_view' }),
    
    // Today's page views
    Analytics.countDocuments({
      event: 'page_view',
      createdAt: { $gte: today },
    }),
    
    // Unique visitors (by session)
    Analytics.distinct('sessionId'),
    
    // Performance metrics
    Analytics.aggregate([
      {
        $match: {
          category: 'performance',
          createdAt: { $gte: weekAgo },
        },
      },
      {
        $group: {
          _id: '$data.metric',
          avgValue: { $avg: '$data.value' },
          count: { $sum: 1 },
          poorCount: {
            $sum: {
              $cond: [{ $eq: ['$data.rating', 'poor'] }, 1, 0],
            },
          },
        },
      },
    ]),
    
    // Recent errors
    Analytics.find({ category: 'error' })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    
    // Top pages
    Analytics.aggregate([
      {
        $match: {
          event: 'page_view',
          createdAt: { $gte: weekAgo },
        },
      },
      {
        $group: {
          _id: '$data.pathname',
          views: { $sum: 1 },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]),
    
    // Device stats
    Analytics.aggregate([
      {
        $match: {
          event: 'page_view',
          createdAt: { $gte: weekAgo },
        },
      },
      {
        $group: {
          _id: '$metadata.device',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  return {
    totalPageViews,
    todayPageViews,
    uniqueVisitors: uniqueVisitors.length,
    performanceMetrics,
    recentErrors,
    topPages,
    deviceStats,
  };
}

function getMetricLabel(metric: string) {
  const labels: Record<string, string> = {
    FCP: 'First Contentful Paint',
    LCP: 'Largest Contentful Paint',
    FID: 'First Input Delay',
    CLS: 'Cumulative Layout Shift',
    TTFB: 'Time to First Byte',
  };
  return labels[metric] || metric;
}

function getMetricUnit(metric: string) {
  return metric === 'CLS' ? '' : 'ms';
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics & Monitoring</h2>
        <p className="text-muted-foreground">
          Track performance, errors, and user behavior
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Total Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalPageViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Today's Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.todayPageViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.uniqueVisitors.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Recent Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.recentErrors.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Core Web Vitals</CardTitle>
            <CardDescription>
              Average performance metrics from the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.performanceMetrics.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No performance data available yet
                </p>
              ) : (
                data.performanceMetrics.map((metric) => {
                  const avgValue = Math.round(metric.avgValue);
                  const unit = getMetricUnit(metric._id);
                  const poorPercentage = (metric.poorCount / metric.count) * 100;
                  
                  return (
                    <div key={metric._id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {getMetricLabel(metric._id)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {avgValue}{unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            poorPercentage > 25
                              ? 'bg-red-500'
                              : poorPercentage > 10
                              ? 'bg-orange-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${100 - poorPercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {metric.count} measurements, {poorPercentage.toFixed(1)}% poor
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>
              Most visited pages in the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topPages.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No page view data available
                </p>
              ) : (
                data.topPages.map((page) => (
                  <div key={page._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium truncate max-w-xs">
                        {page._id || '/'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {page.views} views
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {data.recentErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Errors</CardTitle>
            <CardDescription>
              Latest errors captured by monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentErrors.map((error) => (
                <div
                  key={error._id.toString()}
                  className="border border-red-200 dark:border-red-900 rounded-lg p-4 bg-red-50 dark:bg-red-900/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-red-700 dark:text-red-300">
                        {error.data.type || 'Error'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(error.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-1">
                    {error.data.message || 'Unknown error'}
                  </p>
                  {error.data.url && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Page: {error.data.url}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.deviceStats.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No device data available
                </p>
              ) : (
                data.deviceStats.map((device) => (
                  <div key={device._id || 'unknown'} className="flex items-center justify-between">
                    <span className="text-sm capitalize">
                      {device._id || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {device.count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monitoring Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Error Tracking</span>
              <span className="text-sm text-green-600">✓ Active (Sentry)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Performance Monitoring</span>
              <span className="text-sm text-green-600">✓ Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Custom Analytics</span>
              <span className="text-sm text-green-600">✓ Recording</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Google Analytics</span>
              <span className="text-sm text-green-600">✓ Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Apollo Tracking</span>
              <span className="text-sm text-green-600">✓ Enabled</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
