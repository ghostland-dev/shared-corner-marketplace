import React, { useEffect, useState } from 'react';
import { Activity, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { healthChecker, HealthCheckResult } from '@/lib/health-checker';

interface PerformanceMonitorProps {
  showDetails?: boolean;
  className?: string;
}

export const PerformanceMonitor = ({ 
  showDetails = false, 
  className = '' 
}: PerformanceMonitorProps) => {
  const [results, setResults] = useState<HealthCheckResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>({});

  useEffect(() => {
    // Exécuter un health check initial
    runHealthCheck();
    
    // Collecter les métriques de performance
    collectPerformanceMetrics();

    // Exécuter un health check périodique (toutes les 5 minutes)
    const interval = setInterval(() => {
      runHealthCheck();
      collectPerformanceMetrics();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const runHealthCheck = async () => {
    setIsRunning(true);
    try {
      const checkResults = await healthChecker.runFullHealthCheck();
      setResults(checkResults);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const collectPerformanceMetrics = () => {
    const metrics = {
      loadTime: performance.timing ? 
        performance.timing.loadEventEnd - performance.timing.navigationStart : 0,
      domContentLoaded: performance.timing ? 
        performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart : 0,
      memoryUsage: (performance as any).memory ? {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024)
      } : null,
      connectionType: (navigator as any).connection?.effectiveType || 'unknown'
    };
    setPerformanceMetrics(metrics);
  };

  const summary = healthChecker.getHealthSummary();
  const overallStatus = summary.error > 0 ? 'error' : 
                       summary.warning > 0 ? 'warning' : 'healthy';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800', 
      error: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  if (!showDetails) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Badge 
          className={`flex items-center gap-2 px-3 py-2 ${getStatusBadge(overallStatus)}`}
          onClick={() => runHealthCheck()}
        >
          {getStatusIcon(overallStatus)}
          <span className="text-xs font-medium">
            Système {overallStatus === 'healthy' ? 'OK' : 
                    overallStatus === 'warning' ? 'Attention' : 'Erreur'}
          </span>
          {isRunning && <div className="w-2 h-2 bg-current rounded-full animate-pulse" />}
        </Badge>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Monitoring Système
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runHealthCheck}
            disabled={isRunning}
          >
            {isRunning ? 'Vérification...' : 'Actualiser'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Résumé global */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summary.healthy}</div>
            <div className="text-xs text-muted-foreground">OK</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{summary.warning}</div>
            <div className="text-xs text-muted-foreground">Attention</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{summary.error}</div>
            <div className="text-xs text-muted-foreground">Erreurs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{summary.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>

        {/* Métriques de performance */}
        {performanceMetrics.loadTime && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Performance
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Temps de chargement:</span>
                <span className="ml-2 font-medium">
                  {Math.round(performanceMetrics.loadTime)}ms
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">DOM Ready:</span>
                <span className="ml-2 font-medium">
                  {Math.round(performanceMetrics.domContentLoaded)}ms
                </span>
              </div>
              {performanceMetrics.memoryUsage && (
                <>
                  <div>
                    <span className="text-muted-foreground">Mémoire utilisée:</span>
                    <span className="ml-2 font-medium">
                      {performanceMetrics.memoryUsage.used}MB
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Connexion:</span>
                    <span className="ml-2 font-medium">
                      {performanceMetrics.connectionType}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Détails des vérifications */}
        <div className="space-y-2">
          <h4 className="font-medium">Détails des vérifications</h4>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span>{result.component}</span>
                </div>
                <span className="text-muted-foreground text-xs">
                  {result.message}
                </span>
              </div>
            ))}
          </div>
        </div>

        {lastCheck && (
          <div className="text-xs text-muted-foreground text-center">
            Dernière vérification: {lastCheck.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};